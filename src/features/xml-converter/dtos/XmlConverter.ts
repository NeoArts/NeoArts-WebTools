export interface UploadedXmlFile {
    name: string;
    size: number;
    content: string;
    uploadDate: Date;
}

export interface XmlConversionResult {
    xml: string;
    apoloSaleNumber: number;
    consultantKey: string;
    idOpportunity: string;
    operation: number;
    planCode: string;
    movement: number;
    sarlaft: boolean;
    coberturaMaternidad: boolean;
    anexo: number;
    EsFirma: boolean;
    sicAdicionales: any[];
}

export interface ParsedXmlData {
    apoloSaleNumber?: number;
    consultantKey?: string;
    idOpportunity?: string;
    planCode?: string;
    movement?: number;
}
