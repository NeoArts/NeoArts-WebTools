interface InvoiceCounter {
    id: string;
    lastInvoiceNumber: number;
    year: number;
}

interface StoredInvoice {
    id: string;
    invoiceNumber: string;
    company: { name: string; value: string };
    services: { id: number; name: string; value: number }[];
    createdAt: Date;
    year: number;
}

class InvoiceStorageService {
    private dbName = 'NeoArtsInvoices';
    private version = 1;
    private db: IDBDatabase | null = null;

    private async initDB(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create invoices store
                if (!db.objectStoreNames.contains('invoices')) {
                    const invoicesStore = db.createObjectStore('invoices', { keyPath: 'id' });
                    invoicesStore.createIndex('invoiceNumber', 'invoiceNumber', { unique: true });
                    invoicesStore.createIndex('year', 'year', { unique: false });
                    invoicesStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Create counter store
                if (!db.objectStoreNames.contains('counters')) {
                    db.createObjectStore('counters', { keyPath: 'id' });
                }
            };
        });
    }

    async getNextInvoiceNumber(): Promise<string> {
        const db = await this.initDB();
        const currentYear = new Date().getFullYear();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['counters'], 'readwrite');
            const store = transaction.objectStore('counters');
            const counterId = `invoice-counter-${currentYear}`;

            const getRequest = store.get(counterId);

            getRequest.onsuccess = () => {
                let counter: InvoiceCounter = getRequest.result;

                if (!counter) {
                    // First invoice of the year
                    counter = {
                        id: counterId,
                        lastInvoiceNumber: 1,
                        year: currentYear
                    };
                } else {
                    // Increment the counter
                    counter.lastInvoiceNumber += 1;
                }

                // Update the counter in the database
                const putRequest = store.put(counter);

                putRequest.onsuccess = () => {
                    // Format: NC-YYYY-XXX (NC = Nota de Cobro, YYYY = Year, XXX = Sequential number)
                    const invoiceNumber = `NC-${currentYear}-${counter.lastInvoiceNumber.toString().padStart(3, '0')}`;
                    resolve(invoiceNumber);
                };

                putRequest.onerror = () => {
                    reject(new Error('Failed to update invoice counter'));
                };
            };

            getRequest.onerror = () => {
                reject(new Error('Failed to get invoice counter'));
            };
        });
    }

    async saveInvoice(invoice: any, invoiceNumber: string): Promise<void> {
        const db = await this.initDB();
        const currentYear = new Date().getFullYear();

        const storedInvoice: StoredInvoice = {
            id: `${invoiceNumber}-${Date.now()}`,
            invoiceNumber,
            company: invoice.company,
            services: invoice.services,
            createdAt: new Date(),
            year: currentYear
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['invoices'], 'readwrite');
            const store = transaction.objectStore('invoices');

            const request = store.add(storedInvoice);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to save invoice'));
            };
        });
    }

    async getInvoicesByYear(year: number): Promise<StoredInvoice[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['invoices'], 'readonly');
            const store = transaction.objectStore('invoices');
            const index = store.index('year');

            const request = index.getAll(year);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Failed to get invoices'));
            };
        });
    }

    async getAllInvoices(): Promise<StoredInvoice[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['invoices'], 'readonly');
            const store = transaction.objectStore('invoices');

            const request = store.getAll();

            request.onsuccess = () => {
                // Sort by creation date, newest first
                const invoices = request.result.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                resolve(invoices);
            };

            request.onerror = () => {
                reject(new Error('Failed to get all invoices'));
            };
        });
    }

    async getLastInvoiceNumber(): Promise<string | null> {
        const currentYear = new Date().getFullYear();
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['counters'], 'readonly');
            const store = transaction.objectStore('counters');
            const counterId = `invoice-counter-${currentYear}`;

            const request = store.get(counterId);

            request.onsuccess = () => {
                const counter: InvoiceCounter = request.result;
                if (counter) {
                    const invoiceNumber = `NC-${currentYear}-${counter.lastInvoiceNumber.toString().padStart(3, '0')}`;
                    resolve(invoiceNumber);
                } else {
                    resolve(null); // No invoices created yet this year
                }
            };

            request.onerror = () => {
                reject(new Error('Failed to get last invoice number'));
            };
        });
    }

    async deleteInvoice(id: string): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['invoices'], 'readwrite');
            const store = transaction.objectStore('invoices');

            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to delete invoice'));
            };
        });
    }

    async resetCounter(year?: number): Promise<void> {
        const targetYear = year || new Date().getFullYear();
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['counters'], 'readwrite');
            const store = transaction.objectStore('counters');
            const counterId = `invoice-counter-${targetYear}`;

            const request = store.delete(counterId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to reset counter'));
            };
        });
    }
}

export const invoiceStorage = new InvoiceStorageService();
export type { StoredInvoice, InvoiceCounter };
