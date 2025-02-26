import React, { useState } from "react";

const JsonUploader: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null); // State to store the parsed JSON

  React.useEffect(() => {
    // Open or create the IndexedDB database
    const request = indexedDB.open("QuotesDB", 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // Create an object store called 'quotes' if it doesn't exist
      if (!db.objectStoreNames.contains("quotes")) {
        db.createObjectStore("quotes", { keyPath: "id" }); // Use "id" as the key path
        console.log("Object store 'quotes' created.");
      }
    };

    request.onsuccess = (event: any) => {
      console.log("IndexedDB opened successfully.");
    };

    request.onerror = (event: any) => {
      console.error("IndexedDB error:", event.target.error);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          // Parse the JSON content
          const data = JSON.parse(e.target.result);

          // Check if the file has a `quotes` array
          if (data.quotes && Array.isArray(data.quotes)) {
            setJsonData(data.quotes); // Store the `quotes` array in state
            console.log("Quotes loaded:", data.quotes); // Debug log to verify JSON
          } else {
            console.error("Invalid JSON structure: Missing 'quotes' array.");
          }
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = (): void => {
    if (!jsonData || !Array.isArray(jsonData)) {
      alert("No valid quotes data loaded!");
      return;
    }

    const request = indexedDB.open("QuotesDB", 1);

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction("quotes", "readwrite");
      const objectStore = transaction.objectStore("quotes");

      transaction.oncomplete = () => {
        alert("Quotes have been saved to the database!");
        window.location.reload(); // Reload the page to see the changes
      };

      transaction.onerror = (event: any) => {
        console.error("Transaction error:", event.target.error);
      };

      try {
        // Add each quote to the object store
        jsonData.forEach((quote: any, index: number) => {
          const request = objectStore.add(quote);
          request.onsuccess = () => {
            console.log(`Quote ${index + 1} added successfully.`);
          };
          request.onerror = (event: any) => {
            console.error(`Error adding quote ${index + 1}:`, event.target.error);
          };
        });
      } catch (error) {
        console.error("Error during saving process:", error);
      }
    };

    request.onerror = (event: any) => {
      console.error("IndexedDB error:", event.target.error);
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload JSON to QuotesDB</h1>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ marginTop: "20px" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          display: "block",
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Save Quotes to Database
      </button>
    </div>
  );
};

export default JsonUploader;
