import type { Product } from '../dtos/Product';
import { emptyProduct } from '../constants/emptyProducts';
import { setProductAutomatedFields } from './ProductCalc';

export interface ScrapedProductData {
  name?: string;
  code?: string;
  cost?: number;
  supplier?: string;
  image?: string;
  description?: string;
  stock?: number;
}

export async function scrapeProductFromUrl(url: string): Promise<ScrapedProductData> {
  console.log('=== ProductScraperService: scrapeProductFromUrl called ===');
  console.log('URL:', url);
  
  try {
    // Try multiple CORS proxies in case one fails
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
    ];
    
    let html = '';
    let proxyUsed = '';
    
    for (const proxyUrl of proxies) {
      try {
        console.log('Trying proxy:', proxyUrl);
        const response = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });
        console.log('Proxy response status:', response.status, response.statusText);
        
        if (response.ok) {
          html = await response.text();
          proxyUsed = proxyUrl;
          console.log('HTML fetched successfully, length:', html.length);
          break;
        }
      } catch (proxyError) {
        console.warn('Proxy failed:', proxyUrl, proxyError);
        continue; // Try next proxy
      }
    }
    
    if (!html) {
      throw new Error('All proxy attempts failed. The website might be blocking requests or is temporarily unavailable.');
    }
    
    console.log('Successfully fetched HTML using:', proxyUsed);

    // Parse the HTML using DOMParser (browser API)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    console.log('HTML parsed successfully');

    // Extract product name
    const productName = doc.querySelector('h2')?.textContent?.trim() || 
                        doc.querySelector('h1')?.textContent?.trim() || '';
    console.log('Product name extracted:', productName);

    // Extract product code (OF-546)
    const bodyText = doc.body.textContent || '';
    const productCode = bodyText.match(/OF-\d+/)?.[0] || '';
    console.log('Product code extracted:', productCode);

    // Extract description
    const description = doc.querySelector('p')?.textContent?.trim() || '';
    console.log('Description extracted (first 100 chars):', description.substring(0, 100));

    // Try to extract the product image URL
    // Log all images found for debugging
    const allImages = doc.querySelectorAll('img');
    console.log(`Found ${allImages.length} total images on page`);
    allImages.forEach((img, idx) => {
      console.log(`Image ${idx}: src="${img.getAttribute('src')}", alt="${img.getAttribute('alt')}"`);
    });
    
    // Look for images with "productos/" path (not "productos-s/") and with numeric alt (product ID)
    let imageUrl = Array.from(allImages).find(img => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      // Look for full size product images (not small thumbnails)
      return src.includes('/productos/') && !src.includes('/productos-s/') && /^\d+$/.test(alt);
    })?.getAttribute('src') || 
    // Fallback to any image in productos folder
    doc.querySelector('img[src*="/productos/"]')?.getAttribute('src') || 
    doc.querySelector(`img[alt="${productCode}"]`)?.getAttribute('src') || '';
    
    console.log('Selected image URL:', imageUrl);
    
    // Make sure the image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Handle protocol-relative URLs (starting with //)
      if (imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = `https://catalogospromocionales.com${imageUrl}`;
      } else {
        imageUrl = `https://catalogospromocionales.com/${imageUrl}`;
      }
      console.log('Image URL converted to absolute:', imageUrl);
    }

    // Convert image to base64 if we have a URL
    let imageBase64 = '';
    if (imageUrl) {
      try {
        console.log('Fetching image directly from:', imageUrl);
        // Try fetching the image directly first (images usually allow CORS)
        let imageResponse = await fetch(imageUrl, { mode: 'cors' });
        console.log('Image response status:', imageResponse.status);
        console.log('Image content-type:', imageResponse.headers.get('content-type'));
        
        // If direct fetch fails or returns HTML, try with proxy
        const contentType = imageResponse.headers.get('content-type') || '';
        if (!imageResponse.ok || contentType.includes('text/html')) {
          console.log('Direct fetch failed or returned HTML, trying with CORS proxy...');
          const imageProxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
          imageResponse = await fetch(imageProxyUrl);
          console.log('Proxy image response status:', imageResponse.status);
          console.log('Proxy image content-type:', imageResponse.headers.get('content-type'));
        }
        
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          console.log('Image blob size:', imageBlob.size, 'type:', imageBlob.type);
          
          // Only convert if it's actually an image
          if (imageBlob.type.startsWith('image/')) {
            imageBase64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(imageBlob);
            });
            console.log('Image converted to base64, length:', imageBase64.length);
            console.log('Image data URL prefix:', imageBase64.substring(0, 50));
          } else {
            console.warn('Blob is not an image type:', imageBlob.type);
          }
        }
      } catch (imgError) {
        console.error('Error fetching image:', imgError);
      }
    }

    // Extract stock information from table
    const cells = doc.querySelectorAll('td');
    let stock = 0;
    for (const cell of cells) {
      const text = cell.textContent || '';
      const stockMatch = text.match(/(\d+)/);
      if (text.includes('TOTAL') || text.includes('DISPONIBLE')) {
        const nextCell = cell.nextElementSibling;
        if (nextCell) {
          const stockText = nextCell.textContent || '';
          const match = stockText.match(/(\d+)/);
          if (match) {
            stock = parseInt(match[1]);
            break;
          }
        }
      }
    }
    console.log('Stock extracted:', stock);

    const productData: ScrapedProductData = {
      name: productName,
      code: productCode,
      cost: 0,
      supplier: 'Catálogos Promocionales',
      image: imageBase64,
      description: description,
      stock: stock,
    };

    console.log('Product data prepared:', {
      ...productData,
      image: imageBase64 ? `[base64 string of length ${imageBase64.length}]` : 'no image'
    });

    return productData;
  } catch (error) {
    console.error('=== Error in scrapeProductFromUrl ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

export function mapScrapedDataToProduct(scrapedData: ScrapedProductData, currentId: number): Product {
  console.log('Mapping scraped data to product');
  console.log('Scraped image (first 100 chars):', scrapedData.image?.substring(0, 100));
  
  // Determine provider based on supplier
  let provider = scrapedData.supplier || '';
  if (provider === 'Catálogos Promocionales') {
    provider = 'PROMOS';
  }
  
  const product: Product = {
    ...emptyProduct,
    id: currentId,
    name: scrapedData.name || '',
    markType: '1 TINTA', // Default mark type
    cost: scrapedData.cost || 0,
    provider: provider,
    quantity: 1,
    image: scrapedData.image ? {
      base64String: scrapedData.image, // Keep the full data URL with prefix
      height: 200
    } : emptyProduct.image,
  };
  
  // Apply provider discount and calculate automated fields
  setProductAutomatedFields(product);
  console.log('Product after applying automated fields:', product);
  
  return product;
}
