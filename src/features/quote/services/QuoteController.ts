const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("QuotesDB", 1);
        
        request.onerror = (event) => {
            console.error("Error opening IndexedDB:", event);
            reject(event);
        };
        
        request.onsuccess = (event) => {
            console.log("IndexedDB opened successfully");
            resolve(request.result);
        };
        
        request.onupgradeneeded = (event) => {
            const db = request.result;
            // Create an object store if it doesn't exist
            if (!db.objectStoreNames.contains("quotes")) {
                db.createObjectStore("quotes", { keyPath: "id" });
            }
        };
    });
};

export const getQuotes = async (): Promise<Quote[]> => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("quotes", "readonly");
        const store = transaction.objectStore("quotes");

        const request = store.getAll(); 

        request.onsuccess = (event) => {
            const allQuotes = request.result;
            console.log("All quotes retrieved from IndexedDB:", allQuotes);
            resolve(allQuotes); 
        };

        request.onerror = (event) => {
            console.error("Error retrieving all quotes from IndexedDB:", event);
            reject(event);
        };
    });
};

export const getQuote = async (quoteId:string): Promise<Quote> => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("quotes", "readonly");
        const store = transaction.objectStore("quotes");

        const request = store.get(quoteId); 

        request.onsuccess = (event) => {
            const Quote = request.result;
            console.log("Quote retrieved from IndexedDB:", Quote);
            resolve(Quote); 
        };

        request.onerror = (event) => {
            console.error("Error retrieving all quotes from IndexedDB:", event);
            reject(event);
        };
    });
};

export const updateQuote = async (quote:Quote): Promise<IDBValidKey> => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("quotes", "readwrite");
        const store = transaction.objectStore("quotes");

        const request = store.put(quote); 

        request.onsuccess = (event) => {
            const Quote = request.result;
            console.log("Quote retrieved from IndexedDB:", Quote);
            resolve(Quote); 
        };

        request.onerror = (event) => {
            console.error("Error retrieving all quotes from IndexedDB:", event);
            reject(event);
        };
    });
};

export const deleteQuote = async (id:string) => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("quotes", "readwrite");
        const store = transaction.objectStore("quotes");

        const request = store.delete(id); 

        request.onsuccess = (event) => {
            const Quote = request.result;
            console.log("Quote retrieved from IndexedDB:", Quote);
            resolve(Quote); 
        };

        request.onerror = (event) => {
            console.error("Error retrieving all quotes from IndexedDB:", event);
            reject(event);
        };
    });
};

export const setCurrentQuote = async (quote: Quote) => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.createObjectStore('currentQuote');
        const objectStore = transaction.add("currentQuote", quote.id);

        objectStore.onerror = (e) => {
            console.log("Error while setting current Quote");
            reject(e);
        }

        objectStore.onsuccess = (e) => {
            console.log("Current quote set successfully");
            resolve(objectStore.result);
        }
    })
};

export const createNewQuote = async(quote: Quote) => {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('quotes', 'readwrite');
        const objectStore = transaction.objectStore('quotes');

        const putRequest = objectStore.put(quote);

        putRequest.onerror = (e) => {
            console.log("Error adding the new quote");
            reject(e);
        }

        putRequest.onsuccess = (e) => {
            console.log("New quote successfully");
            resolve(putRequest.result);
        }
    })
}