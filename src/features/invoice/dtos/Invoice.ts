import type { Service } from './Service';

export type Invoice = {
    id: string;
    invoiceNumber?: string;
    company: { name: string, value: string };
    services: Service[];
}