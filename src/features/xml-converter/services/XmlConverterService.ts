import type { ParsedXmlData, XmlConversionResult } from '../dtos/XmlConverter';

export class XmlConverterService {
    /**
     * Minifies XML by removing unnecessary whitespace
     */
    static minifyXml(xmlString: string): string {
        return xmlString
            .replace(/>\s+</g, '><')  // Remove whitespace between tags
            .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
            .trim();
    }

    /**
     * Converts string to base64
     */
    static toBase64(str: string): string {
        return btoa(unescape(encodeURIComponent(str)));
    }

    /**
     * Extracts value from XML tag
     */
    static extractTagValue(xmlString: string, tagName: string): string | null {
        const regex = new RegExp(`<${tagName}>([^<]*)<\/${tagName}>`, 'i');
        const match = xmlString.match(regex);
        return match ? match[1].trim() : null;
    }

    /**
     * Parses XML and extracts required values
     */
    static parseXml(xmlString: string): ParsedXmlData {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        const result: ParsedXmlData = {};

        try {
            // Check if it's Venta or Afiliacion
            const ventaNode = xmlDoc.querySelector('Venta');
            const afiliacionNode = xmlDoc.querySelector('Afiliacion');

            if (ventaNode) {
                // Logic for Venta
                // Extract NumeroAfiliacion from Venta -> Tramite -> NumeroAfiliacion
                const tramiteNode = ventaNode.querySelector('Tramite');
                if (tramiteNode) {
                    const numeroAfiliacionNode = tramiteNode.querySelector('NumeroAfiliacion');
                    if (numeroAfiliacionNode?.textContent) {
                        const value = parseInt(numeroAfiliacionNode.textContent.trim(), 10);
                        if (!isNaN(value)) {
                            result.apoloSaleNumber = value;
                        }
                    }
                }

                // Extract Clave from Venta -> Asesor -> Calve
                const asesorNode = ventaNode.querySelector('Asesor');
                if (asesorNode) {
                    const claveNode = asesorNode.querySelector('Calve');
                    if (claveNode?.textContent) {
                        result.consultantKey = claveNode.textContent.trim();
                    }
                }

                // Extract IdOportunity from Venta -> IdOportunity
                const idOportunityNode = ventaNode.querySelector('IdOportunity');
                if (idOportunityNode?.textContent) {
                    result.idOpportunity = idOportunityNode.textContent.trim();
                }

            } else if (afiliacionNode) {
                // Logic for Afiliacion
                // Extract apoloSaleNumber from Afiliacion -> NumeroAfiliacionApolo
                const numeroAfiliacionApoloNode = afiliacionNode.querySelector('NumeroAfiliacionApolo');
                if (numeroAfiliacionApoloNode?.textContent) {
                    const value = parseInt(numeroAfiliacionApoloNode.textContent.trim(), 10);
                    if (!isNaN(value)) {
                        result.apoloSaleNumber = value;
                    }
                }

                // Extract consultantKey from Afiliacion -> Asesor -> Clave
                const asesorNode = afiliacionNode.querySelector('Asesor');
                if (asesorNode) {
                    const claveNode = asesorNode.querySelector('Clave');
                    if (claveNode?.textContent) {
                        result.consultantKey = claveNode.textContent.trim();
                    }
                }

                // Extract planCode from Afiliacion -> Plan -> Codigo
                const planNode = afiliacionNode.querySelector('Plan');
                if (planNode) {
                    const codigoNode = planNode.querySelector('Codigo');
                    if (codigoNode?.textContent) {
                        result.planCode = codigoNode.textContent.trim();
                    }
                }

                // Extract movement from Afiliacion -> TipoMovimiento
                const tipoMovimientoNode = afiliacionNode.querySelector('TipoMovimiento');
                if (tipoMovimientoNode?.textContent) {
                    const movementText = tipoMovimientoNode.textContent.trim();
                    result.movement = movementText === 'CambioPlan' ? 3 : 1;
                }

                // Extract idOpportunity from Afiliacion -> IdOportunity (Assuming same structure)
                const idOportunityNode = afiliacionNode.querySelector('IdOportunity');
                if (idOportunityNode?.textContent) {
                    result.idOpportunity = idOportunityNode.textContent.trim();
                }
            }

        } catch (error) {
            console.error('Error parsing XML:', error);
            throw new Error('Failed to parse XML structure');
        }

        return result;
    }

    /**
     * Converts XML file content to JSON object
     */
    static convertXmlToJson(xmlContent: string): XmlConversionResult {
        // Parse XML to extract values
        const parsedData = this.parseXml(xmlContent);

        // Minify and convert to base64
        const minifiedXml = this.minifyXml(xmlContent);
        const base64Xml = this.toBase64(minifiedXml);

        // Build the result object with default values
        const result: XmlConversionResult = {
            xml: base64Xml,
            apoloSaleNumber: parsedData.apoloSaleNumber || 0,
            consultantKey: parsedData.consultantKey || "",
            idOpportunity: parsedData.idOpportunity || "",
            operation: 0,
            planCode: parsedData.planCode || "",
            movement: parsedData.movement !== undefined ? parsedData.movement : 1,
            sarlaft: true,
            coberturaMaternidad: false,
            anexo: 1,
            EsFirma: false,
            sicAdicionales: []
        };

        return result;
    }

    /**
     * Generates a text file with JSON content and downloads it
     */
    static downloadAsTextFile(jsonData: XmlConversionResult, filename: string = 'conversion-result.txt'): void {
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
    }

    /**
     * Validates if the file is an XML file
     */
    static isValidXmlFile(filename: string): boolean {
        return filename.toLowerCase().endsWith('.xml');
    }
}
