import type { Product } from '../dtos/Product';
import type { Provider, Discount } from '../../providers/dtos/Provider';

function getProviders() : Provider[]  {
    const providers = localStorage.getItem('providers');

    if(!providers) return [];

    return JSON.parse(providers);
}

export const setProductAutomatedFields = (product: Product, allProducts?: Product[]) => {
    product.providerDiscount = getProviders().find((p:Provider) => p.name === product.provider)?.discount || product.providerDiscount;
    product.costOff = calculateProductDiscount(product, allProducts);
    product.totalCost = calculateProductTotalCost(product);
    product.sellPrice = calculateProductSellPrice(product);
    
    product.totalValue = Number(product.sellPrice) * Number(product.quantity);
}

export const calculateProductDiscount = (product: Product, allProducts?: Product[]) => {
    const provider = getProviders().find((p:Provider) => p.name === product.provider);
    
    const generalDiscount = provider ? provider.discount : product.providerDiscount;
    const wholesomeDiscount = calculateProviderWholesomeDiscount(product, generalDiscount, allProducts);
    const firstDiscount = product.cost * (1 - generalDiscount);
    console.log('provider', provider);
    return Math.ceil(firstDiscount * (1 - wholesomeDiscount) * 100) / 100;
}

export const calculateProductTotalCost = (product: Product) => {
    return Number(product.costOff) + Number(product.markCost) + Number(product.otherCost);
}

export const calculateProductSellPrice = (product: Product) => {
    return Math.round(product.totalCost/(product.profit ? Number(product.profit/100) : 1));
}

export const calculateProviderWholesomeDiscount = (product:Product, generalDiscount:number, allProducts?: Product[]) =>
{
    const provider = getProviders().find((p:any) => p.name === product.provider);
    
    if(!provider || provider.wholesaleDiscount.length === 0) return 0;

    // Calculate total cost based on grouping
    let totalCost = 0;
    
    if (product.discountGroup && allProducts) {
        // If product has a group, sum all products in the same group with the same provider
        const groupedProducts = allProducts.filter(p => 
            p.discountGroup === product.discountGroup && 
            p.provider === product.provider &&
            p.discountGroup !== '' && 
            p.discountGroup !== undefined
        );
        
        totalCost = groupedProducts.reduce((sum, p) => {
            const firstDiscountPrice = Number(p.cost) * Number(1 - generalDiscount);
            return sum + (firstDiscountPrice * p.quantity);
        }, 0);
    } else {
        // Individual product calculation (no grouping)
        const firstDiscountPrice = Number(product.cost) * Number(1 - generalDiscount);
        totalCost = firstDiscountPrice * product.quantity;
    }

    // Find applicable discount tier
    const discounts = provider.wholesaleDiscount.sort((a: any, b: any) => b.amount - a.amount);

    for (let i = 0; i < discounts.length; i++) {
        const discount: Discount = discounts[i];
        if(totalCost >= discount.amount) return discount.discount
    }

    return 0;
}