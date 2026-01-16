import React, { useState } from 'react';
import Button from '../../../shared/ui/components/Button';
import XmlUploader from './XmlUploader';
import { XmlConverterService } from '../services/XmlConverterService';
import type { UploadedXmlFile, XmlConversionResult } from '../dtos/XmlConverter';
import { NotificationService } from '../../../shared/services/notifications';

export default function XmlConverter() {
    const [uploadedFile, setUploadedFile] = useState<UploadedXmlFile | null>(null);
    const [conversionResult, setConversionResult] = useState<XmlConversionResult | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleFileUploaded = (file: UploadedXmlFile) => {
        setUploadedFile(file);
        setConversionResult(null);
    };

    const handleConvert = () => {
        if (!uploadedFile) {
            NotificationService.warning('Por favor carga un archivo XML primero');
            return;
        }

        setIsConverting(true);

        try {
            const result = XmlConverterService.convertXmlToJson(uploadedFile.content);
            setConversionResult(result);
            NotificationService.success('Conversión completada exitosamente');
        } catch (error) {
            console.error('Conversion error:', error);
            NotificationService.error('Error al convertir el archivo XML');
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (!conversionResult) {
            NotificationService.warning('No hay resultados para descargar');
            return;
        }

        try {
            const filename = uploadedFile?.name.replace('.xml', '-converted.txt') || 'conversion-result.txt';
            XmlConverterService.downloadAsTextFile(conversionResult, filename);
            NotificationService.success('Archivo descargado exitosamente');
        } catch (error) {
            console.error('Download error:', error);
            NotificationService.error('Error al descargar el archivo');
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setConversionResult(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Upload Section */}
            {!uploadedFile && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Cargar archivo XML
                        </h2>
                        <p className="text-sm text-gray-600">
                            Sube tu archivo XML para convertirlo a formato JSON
                        </p>
                    </div>
                    <XmlUploader onFileUploaded={handleFileUploaded} />
                </div>
            )}

            {/* File Info and Conversion Section */}
            {uploadedFile && !conversionResult && (
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{uploadedFile.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tamaño: {formatFileSize(uploadedFile.size)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Cargado: {new Date(uploadedFile.uploadDate).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Cambiar archivo"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            text={isConverting ? 'Convirtiendo...' : 'Convertir a JSON'}
                            onClick={handleConvert}
                            disabled={isConverting}
                            className="flex-1"
                        />
                        <Button
                            text="Cancelar"
                            onClick={handleReset}
                            variant="secondary"
                            disabled={isConverting}
                        />
                    </div>
                </div>
            )}

            {/* Results Section */}
            {conversionResult && (
                <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">Conversión completada</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    El archivo XML ha sido convertido exitosamente a formato JSON
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Extracted Values Display */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Valores extraídos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Número de Afiliación (Apolo)
                                </label>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {conversionResult.apoloSaleNumber || 'No encontrado'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Clave del Consultor
                                </label>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {conversionResult.consultantKey || 'No encontrado'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID Oportunidad
                                </label>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {conversionResult.idOpportunity || 'No especificado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* JSON Preview */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Vista previa JSON</h4>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-green-400 font-mono">
                                {JSON.stringify(conversionResult, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            text="Descargar archivo TXT"
                            onClick={handleDownload}
                            className="flex-1"
                        />
                        <Button
                            text="Convertir otro archivo"
                            onClick={handleReset}
                            variant="secondary"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
