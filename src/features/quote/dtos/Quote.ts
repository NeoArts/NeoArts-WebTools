import type { Product } from './Product';

export type Quote = {
    id: string,
    client: string,
    number: string,
    date: string,
    products: Product[]
}