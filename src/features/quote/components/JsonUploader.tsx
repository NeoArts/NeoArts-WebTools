import React, { useState } from "react";
import Button from "../../../shared/ui/components/Button";
import { NotificationService } from "../../../shared/services/notifications";

const JsonUploader: React.FC = () => {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
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

  const validateSingleQuote = (data: any): boolean => {
    if (!data) return false;
    
    // Check if it's a single quote object
    return !!(data.id && data.client && data.number && data.date);
  };

  const processFiles = (files: FileList): void => {
    const fileArray = Array.from(files);
    const newQuotes: any[] = [];
    const newFileNames: string[] = [];
    let processedCount = 0;
    let errorCount = 0;

    fileArray.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (!validateSingleQuote(data)) {
            console.error(`Invalid quote structure in file: ${file.name}`);
            errorCount++;
          } else {
            newQuotes.push(data);
            newFileNames.push(file.name);
          }

          processedCount++;

          // When all files are processed
          if (processedCount === fileArray.length) {
            if (newQuotes.length > 0) {
              setJsonData(prev => [...prev, ...newQuotes]);
              setFileNames(prev => [...prev, ...newFileNames]);
              NotificationService.success(
                `${newQuotes.length} archivo${newQuotes.length !== 1 ? 's' : ''} cargado${newQuotes.length !== 1 ? 's' : ''} exitosamente`
              );
            }
            
            if (errorCount > 0) {
              NotificationService.warning(
                `${errorCount} archivo${errorCount !== 1 ? 's' : ''} con estructura inválida`
              );
            }
          }
        } catch (err) {
          console.error(`Error parsing JSON from ${file.name}:`, err);
          errorCount++;
          processedCount++;
          
          if (processedCount === fileArray.length && errorCount === fileArray.length) {
            NotificationService.error("Error al leer los archivos JSON. Verifique que el formato sea correcto.");
          }
        }
      };

      reader.onerror = () => {
        errorCount++;
        processedCount++;
        
        if (processedCount === fileArray.length) {
          NotificationService.error("Error al leer uno o más archivos");
        }
      };

      reader.readAsText(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validate all files are JSON
      const invalidFiles = Array.from(files).filter(
        file => file.type !== "application/json" && !file.name.endsWith('.json')
      );
      
      if (invalidFiles.length > 0) {
        NotificationService.error("Por favor seleccione solo archivos JSON válidos");
        return;
      }
      
      processFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Validate all files are JSON
      const invalidFiles = Array.from(files).filter(
        file => file.type !== "application/json" && !file.name.endsWith('.json')
      );
      
      if (invalidFiles.length > 0) {
        NotificationService.error("Por favor seleccione solo archivos JSON válidos");
        return;
      }
      
      processFiles(files);
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
    if (!jsonData || jsonData.length === 0) {
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
          setJsonData([]);
          setFileNames([]);
          
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
    setJsonData([]);
    setFileNames([]);
    NotificationService.info("Datos limpiados");
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-purple-400 bg-purple-50'
            : jsonData.length > 0
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
            {jsonData.length > 0 ? (
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
            {jsonData.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-green-900">
                  ✅ {jsonData.length} archivo{jsonData.length !== 1 ? 's' : ''} cargado{jsonData.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  {jsonData.length} cotización{jsonData.length !== 1 ? 'es' : ''} lista{jsonData.length !== 1 ? 's' : ''} para importar
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Arrastrar archivos JSON aquí
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  o haz clic para seleccionar archivos
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Acepta múltiples archivos JSON de cotizaciones individuales
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
              multiple
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {jsonData.length > 0 ? 'Agregar más archivos' : 'Seleccionar archivos'}
            </label>
          </div>
        </div>
      </div>

      {/* File Details */}
      {jsonData.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Vista previa de importación</h4>
          
          {/* Files List */}
          <div className="max-h-48 overflow-y-auto mb-3 space-y-1">
            {fileNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded border border-blue-100">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-blue-900 truncate">{name}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Total de archivos:</span>
              <span className="font-medium text-blue-900">{jsonData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Cotizaciones a importar:</span>
              <span className="font-medium text-blue-900">{jsonData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Acción:</span>
              <span className="font-medium text-blue-900">Agregar a base de datos</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              <strong>Nota:</strong> Las cotizaciones duplicadas (mismo ID) no se importarán.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {jsonData.length > 0 && (
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
          disabled={jsonData.length === 0 || isUploading}
          loading={isUploading}
          variant={jsonData.length > 0 ? 'success' : 'primary'}
        />
      </div>
    </div>
  );
};

export default JsonUploader;
