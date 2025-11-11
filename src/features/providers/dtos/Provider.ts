export type Provider = {
    id: number,
    name: string,
    discount: number,
    wholesaleDiscount: Discount[]
}

export type Discount = {
    amount: number,
    discount: number
}