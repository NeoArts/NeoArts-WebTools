import { getLastMonth, getSpanishFormattedDate } from "../../../shared/services/dateUtils";
import { pdfImages, quoteTemplate } from "../../pdf/assets/pdfImages";
import { PdfProvider } from "../../pdf/services/pdfUtils";
import { invoiceStorage } from "./invoiceStorage";
import type { Invoice } from "../dtos/Invoice";
import type { Quote } from "../../quote/dtos/Quote";

export const generateInvoice = async (invoice: Invoice) => {
    try {
        // Generate invoice number if not provided
        if (!invoice.invoiceNumber) {
            invoice.invoiceNumber = await invoiceStorage.getNextInvoiceNumber();
        }

        // Save invoice to storage
        await invoiceStorage.saveInvoice(invoice, invoice.invoiceNumber);

        // Create PDF with custom margins for invoice
        const doc = new PdfProvider({
            leftMargin: 60,
            rightMargin: 80,
            topMargin: 105,
            bottomMargin: 90
        });
        
        // Set up header and footer templates
        doc.SetDefaultInvoiceHeader();
        doc.SetDefaultInvoiceFooter();
        
        doc.SetFont("Montserrat");
        
        doc.AddHeader3(`CUENTA DE COBRO`, "black");
        doc.AddHeader6("Número:");
        doc.AddLine(`${invoice.invoiceNumber}`);
        doc.AddBlankLines(1); // Reduced from 3 for better spacing
        doc.AddHeader6("Fecha de emisión:");
        doc.AddLine(`${getSpanishFormattedDate()}`);
        doc.AddBlankLines(1);
        doc.AddHeader6("Facturar a:");
        doc.AddHeader6(invoice.company.name);
        doc.AddLine(`${invoice.company.value.includes("-") ? "NIT" : "CC"}: ${invoice.company.value}`);
        doc.AddBlankLines(1);
        doc.AddHeader6("Por el concepto de:");
    
    // Table will automatically handle positioning and page breaks
    doc.AddTable(
        [
            {text: "Servicio", width: 0.5}, 
            {text: "Valor", width: 0.3}
        ],
        [
            ...invoice.services.map(service => [service.name, `$${addThousandSeparator(service.value)} COP`]),
            ["Total a pagar", `$${addThousandSeparator(invoice.services.reduce((acc, curr) => acc + curr.value, 0))} COP`]
        ]
    );

    function addThousandSeparator(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    doc.AddBlankLines(2); // Improved automatic spacing instead of manual calculation
    doc.SetTextColor(135, 135, 135);
    // Use AddParagraph with justification for better text layout
    const legalText = `Declaro voluntariamente y bajo la gravedad de juramento, que pertenezco al régimen simplificado, por lo tanto, de acuerdo al Art 42 del Decreto 3541 de 1983 y Art 511 del ET, no estoy obligado a expedir factura de venta. CERTIFICO QUE: la prestación de este servicio se realizó de manera personal, por tanto: "Certifico bajo la gravedad de juramento que en el desarrollo de mis actividades de servicios, no tengo contratado o vinculado dos (2) o más trabajadores o contratistas asociados a mi actividad económica por un término superior a 90 días continuos o discontinuos. De acuerdo con lo anterior, solicito para efectos de retención en la fuente me sea aplicado del Estatuto Tributario el artículo 383"`;

    doc.AddParagraph(legalText, { align: 'justify' });
    doc.SetTextColor(0, 0, 0);

    doc.AddBlankLines(2);
    doc.AddLine("Cordialmente");
    
    // Use AddSign for automatic positioning instead of absolute coordinates
    doc.AddSign(pdfImages.sign, "PNG", 60, 120, 80); // x=0 uses current margin
    
    doc.AddBlankLines(1);
    doc.AddLine("Tomás Parra Monroy");
    doc.AddLine("CC 1.001.098.088");
    doc.DownloadPdf(`Cuenta de cobro ${invoice.invoiceNumber} - ${invoice.company.name} ${getSpanishFormattedDate()}.pdf`);

    return invoice.invoiceNumber;
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw new Error('Failed to generate invoice');
    }
};

export const generateQuote = (quote: Quote) => {
    // Create PDF with custom margins for quote
    const doc = new PdfProvider({
        leftMargin: 60,
        rightMargin: 60,
        topMargin: 75,
        bottomMargin: 90
    });
    
    // Set up templates at the beginning for proper header/footer on all pages
    doc.SetDefaultHeader();
    doc.SetDefaultFooter();
    
    doc.SetFont("Montserrat");
    
    doc.AddLine(`Bogotá D.C.`);
    doc.AddLine(`${getSpanishFormattedDate()}`);
    doc.AddBlankLines(1);
    doc.AddLine("Señores");
    doc.AddLine(quote.client);
    doc.AddLine("Bogotá");
    doc.AddBlankLines(1);
    doc.AddHeader6("REF: VPM-" + quote.number);
    doc.AddBlankLines(1);
    doc.AddLine("Tenemos el agrado de cotizar las siguientes referencias");
    doc.AddBlankLines(1);
    
    // Table with improved automatic positioning and page break handling
    doc.AddTable(
        [
            {text: "ARTICULO", width: 0.2}, 
            {text: "MARCA", width: 0.1},
            {text: "IMAGEN", width: 0.2},
            {text: "UND", width: 0.1},
            {text: "VALOR UN", width: 0.2}
        ],
        [
            ...quote.products.map(product => [product.name, product.markType, "", product.quantity.toString(), `$${addThousandSeparator(product.sellPrice)} COP`])
        ], 
        [...quote.products.map((x:any) => x.image.height)], 
        quote.products
    );

    function addThousandSeparator(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    doc.SetTextColor(0, 0, 0);
    doc.AddLine('NOTA: Las cantidades  entregadas pueden variar en un 2% aproximadamente,');
    doc.AddLine('sobre el total de la orden.');
    doc.AddBlankLines(1);
    doc.AddLine('Cantidad sujeta a disponibilidad de inventario al momento de la orden de compra.');
    doc.AddLine('Los precios aplican únicamente a las cantidades establecidas en este documento. ');

    doc.AddBlankLines(1);
    doc.AddLineTab("IVA", "19%");
    doc.AddLineTab("Validez de la oferta:", "3 días");
    doc.AddLineTab("Forma de pago:", "A convenir");
    doc.AddLineTab("Tiempo de producción:", "A convenir");
    doc.AddLineTab("Entrega(s):", "A convenir");

    // Use AddSign for automatic positioning instead of absolute coordinates
    doc.AddSign(quoteTemplate.sign, "PNG", 0, 220, 80); // x=0 uses current margin
    
    // Templates are already applied at the beginning, no need to call AddTemplate() here
    doc.DownloadPdf(`Cotización ${quote.client} ${"REF: VPM-" + quote.number}.pdf`);
};

export const templates = [
    {
        id: 1,
        name: "Identidad Corporativa",
        description: "Creación de Identidad Corporativa",
        value: 0,
        company: "All"
    },
    {
        id: 2,
        name: "Página web",
        description: "Creación de Página web",
        value: 0,
        company: "All"
    },
    {
        id: 0,
        name: "Manejo de redes",
        description: `Manejo de redes sociales mes de ${getLastMonth()}`,
        value: 250000,
        company: "Ensafe SAS"
    },
]