function getProviders() : Provider[]  {
    const providers = localStorage.getItem('providers');

    if(!providers) return [];

    return JSON.parse(providers);
}

export const setProductAutomatedFields = (product: Product) => {
    product.providerDiscount = getProviders().find((p:Provider) => p.name === product.provider)?.discount || product.providerDiscount;
    product.costOff = calculateProductDiscount(product);
    product.totalCost = calculateProductTotalCost(product);
    product.sellPrice = calculateProductSellPrice(product);
    
    product.totalValue = Number(product.sellPrice) * Number(product.quantity);
}

export const calculateProductDiscount = (product: Product) => {
    const provider = getProviders().find((p:Provider) => p.name === product.provider);
    
    const generalDiscount = provider ? provider.discount : product.providerDiscount;
    const wholesomeDiscount = calculateProviderWholesomeDiscount(product, generalDiscount);
    const firstDiscount = product.cost * (1 - generalDiscount);

    return Math.ceil(firstDiscount * (1 - wholesomeDiscount) * 100) / 100;
}

export const calculateProductTotalCost = (product: Product) => {
    return Number(product.costOff) + Number(product.markCost) + Number(product.otherCost);
}

export const calculateProductSellPrice = (product: Product) => {
    return Math.round(product.totalCost/(product.profit ? Number(product.profit/100) : 1));
}

export const calculateProviderWholesomeDiscount = (product:Product, generalDiscount:number) =>
{
    const provider = getProviders().find((p:any) => p.name === product.provider);
    const firstDiscountPrice = Number(product.cost) * Number(1 - generalDiscount);
    const totalCost = firstDiscountPrice * product.quantity;

    if(!provider || provider.wholesaleDiscount.length === 0) return 0;
    
    const discounts = provider.wholesaleDiscount.sort((a: any, b: any) => b.amount - a.amount);

    for (let i = 0; i < discounts.length; i++) {
        const discount: Discount = discounts[i];
        if(totalCost >= discount.amount) return discount.discount
    }

    return 0;
}