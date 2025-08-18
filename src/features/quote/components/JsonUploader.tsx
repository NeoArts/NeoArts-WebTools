import React, { useState } from "react";
import Button from "../../../shared/ui/components/Button";
import { NotificationService } from "../../../shared/services/notifications";

const JsonUploader: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  React.useEffect(() => {
    // Initialize IndexedDB
    const request = indexedDB.open("QuotesDB", 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("quotes")) {
        db.createObjectStore("quotes", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      // DB opened successfully
    };

    request.onerror = (event: any) => {
      console.error("IndexedDB error:", event.target.error);
      NotificationService.error("Error al inicializar la base de datos");
    };
  }, []);

  const validateJsonStructure = (data: any): boolean => {
    if (!data) return false;
    
    // Check if it's a backup file with quotes property
    if (data.quotes && Array.isArray(data.quotes)) {
      return data.quotes.every((quote: any) => 
        quote.id && 
        quote.client && 
        quote.number && 
        quote.date
      );
    }
    
    // Check if it's a direct array of quotes
    if (Array.isArray(data)) {
      return data.every((quote: any) => 
        quote.id && 
        quote.client && 
        quote.number && 
        quote.date
      );
    }
    
    return false;
  };

  const processFile = (file: File): void => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // if (!validateJsonStructure(data)) {
        //   NotificationService.error("Estructura de archivo JSON inválida. Debe contener un array de cotizaciones válidas.");
        //   return;
        // }

        // Extract quotes array (handle both backup format and direct array)
        const quotes = data.quotes || data;
        setJsonData(quotes);
        setFileName(file.name);
        NotificationService.success(`Archivo cargado: ${quotes.length} cotización${quotes.length !== 1 ? 'es' : ''} encontrada${quotes.length !== 1 ? 's' : ''}`);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        NotificationService.error("Error al leer el archivo JSON. Verifique que el formato sea correcto.");
      }
    };

    reader.onerror = () => {
      NotificationService.error("Error al leer el archivo");
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        NotificationService.error("Por favor seleccione un archivo JSON válido");
        return;
      }
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        NotificationService.error("Por favor seleccione un archivo JSON válido");
        return;
      }
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!jsonData || !Array.isArray(jsonData)) {
      NotificationService.error("No hay datos válidos para importar");
      return;
    }

    setIsUploading(true);

    try {
      const request = indexedDB.open("QuotesDB", 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction("quotes", "readwrite");
        const objectStore = transaction.objectStore("quotes");

        let successCount = 0;
        let errorCount = 0;
        let duplicateCount = 0;

        transaction.oncomplete = () => {
          setIsUploading(false);
          
          if (successCount > 0) {
            NotificationService.success(
              `✅ ${successCount} cotización${successCount !== 1 ? 'es' : ''} importada${successCount !== 1 ? 's' : ''} exitosamente`
            );
          }
          
          if (duplicateCount > 0) {
            NotificationService.warning(
              `⚠️ ${duplicateCount} cotización${duplicateCount !== 1 ? 'es' : ''} ya existía${duplicateCount !== 1 ? 'n' : ''} en la base de datos`
            );
          }
          
          if (errorCount > 0) {
            NotificationService.error(
              `❌ Error al importar ${errorCount} cotización${errorCount !== 1 ? 'es' : ''}`
            );
          }

          // Reset form
          setJsonData(null);
          setFileName("");
          
          // Reload page to see changes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        };

        transaction.onerror = () => {
          setIsUploading(false);
          NotificationService.error("Error en la transacción de base de datos");
        };

        // Process each quote
        jsonData.forEach((quote: any) => {
          const addRequest = objectStore.add(quote);
          
          addRequest.onsuccess = () => {
            successCount++;
          };
          
          addRequest.onerror = (event: any) => {
            if (event.target.error.name === 'ConstraintError') {
              duplicateCount++;
            } else {
              errorCount++;
              console.error(`Error adding quote:`, event.target.error);
            }
          };
        });
      };

      request.onerror = () => {
        setIsUploading(false);
        NotificationService.error("Error al abrir la base de datos");
      };
    } catch (error) {
      setIsUploading(false);
      console.error("Error during saving process:", error);
      NotificationService.error("Error inesperado durante la importación");
    }
  };

  const clearData = (): void => {
    setJsonData(null);
    setFileName("");
    NotificationService.info("Datos limpiados");
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-purple-400 bg-purple-50'
            : jsonData
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-3">
          {/* Icon */}
          <div className="mx-auto">
            {jsonData ? (
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            {jsonData ? (
              <div>
                <h3 className="text-lg font-medium text-green-900">
                  ✅ Archivo cargado exitosamente
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  <strong>{fileName}</strong>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {jsonData.length} cotización{jsonData.length !== 1 ? 'es' : ''} lista{jsonData.length !== 1 ? 's' : ''} para importar
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Arrastrar archivo JSON aquí
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  o haz clic para seleccionar un archivo
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Acepta archivos de copia de seguridad (.json) de cotizaciones
                </p>
              </div>
            )}
          </div>

          {/* File Input */}
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {jsonData ? 'Cambiar archivo' : 'Seleccionar archivo'}
            </label>
          </div>
        </div>
      </div>

      {/* File Details */}
      {jsonData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Vista previa de importación</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Archivo:</span>
              <span className="font-medium text-blue-900">{fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Cotizaciones:</span>
              <span className="font-medium text-blue-900">{jsonData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Acción:</span>
              <span className="font-medium text-blue-900">Agregar a base de datos</span>
            </div>
          </div>
          
          {jsonData.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600">
                <strong>Nota:</strong> Las cotizaciones duplicadas (mismo ID) no se importarán.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {jsonData && (
          <Button
            text="Limpiar"
            onClick={clearData}
            variant="tertiary"
            disabled={isUploading}
          />
        )}
        <Button
          text={isUploading ? 'Importando...' : 'Importar Cotizaciones'}
          onClick={handleSubmit}
          disabled={!jsonData || isUploading}
          loading={isUploading}
          variant={jsonData ? 'success' : 'primary'}
        />
      </div>
    </div>
  );
};

export default JsonUploader;
