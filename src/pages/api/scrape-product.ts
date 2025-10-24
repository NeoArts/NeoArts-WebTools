import type { APIRoute } from 'astro';
import * as cheerio from 'cheerio';

// API endpoint for scraping product information from catalogospromocionales.com  
export const POST: APIRoute = async ({ request }) => {
  console.log('=== Scrape Product API Called v2 ===');
  console.log('Request method:', request.method);
  console.log('Request content-type:', request.headers.get('content-type'));
  
  try {
    let body;
    try {
      body = await request.json();
      console.log('Successfully parsed request body:', JSON.stringify(body));
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        parseError: jsonError instanceof Error ? jsonError.message : String(jsonError)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { url } = body;

    if (!url || typeof url !== 'string') {
      console.error('Invalid URL provided:', url);
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Scraping URL:', url);

    // Validate the URL is from catalogospromocionales.com
    if (!url.includes('catalogospromocionales.com')) {
      console.error('URL not from catalogospromocionales.com:', url);
      return new Response(JSON.stringify({ error: 'Only catalogospromocionales.com URLs are supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch the HTML content
    console.log('Fetching HTML from URL...');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      }
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('HTML fetched, length:', html.length);
    
    const $ = cheerio.load(html);
    console.log('Cheerio loaded successfully');

    // Extract product name (from h2 with class that contains "Sticky Set Doctor")
    const productName = $('h2').first().text().trim() || 
                        $('h2.product-title').text().trim() ||
                        $('h1').first().text().trim();
    console.log('Product name extracted:', productName);

    // Extract product code (OF-546)
    const productCode = $('body').text().match(/OF-\d+/)?.[0] || '';
    console.log('Product code extracted:', productCode);

    // Extract description
    const description = $('p').first().text().trim();
    console.log('Description extracted (first 100 chars):', description.substring(0, 100));

    // Try to extract the product image URL
    let imageUrl = $('img[src*="productos"]').first().attr('src') || 
                   $('img[alt*="' + productCode + '"]').attr('src') ||
                   $('img').first().attr('src') || '';
    
    console.log('Image URL found:', imageUrl);
    
    // Make sure the image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = imageUrl.startsWith('/') 
        ? `https://catalogospromocionales.com${imageUrl}`
        : `https://catalogospromocionales.com/${imageUrl}`;
      console.log('Image URL converted to absolute:', imageUrl);
    }

    // Convert image to base64 if we have a URL
    let imageBase64 = '';
    if (imageUrl) {
      try {
        console.log('Fetching image from:', imageUrl);
        const imageResponse = await fetch(imageUrl);
        console.log('Image response status:', imageResponse.status);
        
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          imageBase64 = `data:${contentType};base64,${base64}`;
          console.log('Image converted to base64, length:', imageBase64.length);
        }
      } catch (imgError) {
        console.error('Error fetching image:', imgError);
      }
    }

    // Extract stock information
    const stockText = $('td').text();
    const stockMatch = stockText.match(/TOTAL DISPONIBLE.*?(\d+)/);
    const stock = stockMatch ? parseInt(stockMatch[1]) : 0;
    console.log('Stock extracted:', stock);

    const productData = {
      name: productName,
      code: productCode,
      cost: 0, // Cost is usually only visible to logged-in distributors
      supplier: 'Catálogos Promocionales',
      image: imageBase64,
      description: description,
      stock: stock,
    };

    console.log('Product data prepared:', {
      ...productData,
      image: imageBase64 ? `[base64 string of length ${imageBase64.length}]` : 'no image'
    });

    const responseBody = JSON.stringify(productData);
    console.log('Response body length:', responseBody.length);

    return new Response(responseBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== Scraping error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return new Response(JSON.stringify({ 
      error: 'Failed to scrape product', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
