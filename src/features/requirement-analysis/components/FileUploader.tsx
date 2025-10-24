import React, { useState, useRef, useCallback } from 'react';
import Button from '../../../shared/ui/components/Button';
import { RequirementAnalysisService } from '../services/RequirementAnalysisService';
import type { UploadedFile } from '../dtos/RequirementAnalysis';
import { NotificationService } from '../../../shared/services/notifications';

interface FileUploaderProps {
    onFilesUploaded: (files: UploadedFile[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

export default function FileUploader({ onFilesUploaded, maxFiles = 10, disabled = false }: FileUploaderProps) {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateId = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const processFiles = useCallback(async (files: FileList) => {
        if (disabled || uploading) return;

        const filesArray = Array.from(files);
        const totalFiles = uploadedFiles.length + filesArray.length;

        if (totalFiles > maxFiles) {
            NotificationService.error(`Máximo ${maxFiles} archivos permitidos`);
            return;
        }

        setUploading(true);

        try {
            const newUploadedFiles: UploadedFile[] = [];

            for (const file of filesArray) {
                // Validate file
                const validation = RequirementAnalysisService.validateFile(file);
                if (!validation.valid) {
                    NotificationService.error(`Error en ${file.name}: ${validation.error}`);
                    continue;
                }

                // Read file content
                const content = await readFileAsArrayBuffer(file);
                
                const uploadedFile: UploadedFile = {
                    id: generateId(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    content,
                    uploadedAt: new Date()
                };

                newUploadedFiles.push(uploadedFile);
            }

            const allFiles = [...uploadedFiles, ...newUploadedFiles];
            setUploadedFiles(allFiles);
            onFilesUploaded(allFiles);

            if (newUploadedFiles.length > 0) {
                NotificationService.success(`${newUploadedFiles.length} archivo(s) cargado(s) exitosamente`);
            }
        } catch (error) {
            NotificationService.error('Error al procesar los archivos');
            console.error('File processing error:', error);
        } finally {
            setUploading(false);
        }
    }, [uploadedFiles, maxFiles, disabled, uploading, onFilesUploaded]);

    const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled && e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    }, [disabled, processFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    }, [processFiles]);

    const removeFile = (fileId: string) => {
        const newFiles = uploadedFiles.filter(f => f.id !== fileId);
        setUploadedFiles(newFiles);
        onFilesUploaded(newFiles);
    };

    const clearAllFiles = () => {
        setUploadedFiles([]);
        onFilesUploaded([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'xlsx':
            case 'xls':
                return '📊';
            case 'docx':
                return '📝';
            case 'md':
                return '�';
            case 'txt':
                return '�';
            default:
                return '📁';
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all
                    ${dragOver && !disabled 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={disabled}
                    accept=".pdf,.xlsx,.xls,.docx,.md,.txt"
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-gray-100 rounded-full">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            {uploading ? 'Procesando archivos...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Soporta: PDF, Excel (XLSX/XLS), Word (DOCX), Markdown (MD), Texto plano (TXT)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Máximo {maxFiles} archivos, 50MB por archivo
                        </p>
                    </div>

                    {uploading && (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Archivos cargados ({uploadedFiles.length}/{maxFiles})
                        </h3>
                        <Button
                            text="Limpiar todo"
                            onClick={clearAllFiles}
                            variant="tertiary"
                            size="sm"
                            disabled={disabled}
                        />
                    </div>

                    <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl flex-shrink-0">
                                        {getFileIcon(file.name)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)} • {file.type || 'Tipo desconocido'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    disabled={disabled}
                                    title="Eliminar archivo"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
