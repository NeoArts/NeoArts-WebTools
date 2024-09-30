import { getLastMonth, getSpanishFormattedDate } from "../../../shared/services/dateUtils";
import { pdfImages, quoteTemplate } from "../../pdf/assets/pdfImages";
import { PdfProvider } from "../../pdf/services/pdfUtils";

export const generateInvoice = (invoice: Invoice) => {
    const doc = new PdfProvider();
    const header = pdfImages.header;
    
    doc.SetMargin(60);
    doc.SetFont("Montserrat");
    doc.AddImage(header, "PNG", 0, 100, 0, 35);
    
    doc.AddHeader6("CUENTA DE COBRO", "white");
    doc.AddBlankLines(3);
    doc.AddLine(`Bogotá D.C. ${getSpanishFormattedDate()}`);
    doc.AddBlankLines(1);
    doc.AddLine(invoice.company);
    doc.AddLine("NIT. 900392150-2");
    doc.AddBlankLines(1);
    doc.AddHeader6("debe a:");
    doc.AddBlankLines(1);
    doc.AddLine("Tomás Parra Monroy (NEO ARTS)");
    doc.AddLine("NIT. 1.001.098.088-3");
    doc.AddBlankLines(2);
    doc.AddHeader6("Por el concepto de:");
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

    doc.AddBlankLines(invoice.services.length + 5);
    doc.SetTextColor(135, 135, 135);
    doc.AddLine('Declaro voluntariamente y bajo la gravedad de juramento, que pertenezco al');
    doc.AddLine('régimen simplificado, por lo tanto, de acuerdo al Art 42 del Decreto 3541 de 1983 y');
    doc.AddLine('Art 511 del ET, no estoy obligado a expedir factura de venta');
    doc.SetTextColor(0, 0, 0);

    doc.AddBlankLines(3);
    doc.AddLine("Cordialmente");
    doc.AddImage(pdfImages.sign, "PNG", 40, 588, 120, 80);
    doc.AddBlankLines(6);
    doc.AddLine("Tomás Parra Monroy");
    doc.AddLine("CC 1.001.098.088");
    doc.DownloadPdf(`Cuenta de cobro ${invoice.company} ${getSpanishFormattedDate()}.pdf`);
};

export const generateQuote = (quote: Quote) => {
    const doc = new PdfProvider();
    
    doc.SetMargin(60);
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
        ]
    , [...quote.products.map((x:any) => x.image.height)], quote.products);

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

    doc.AddSign(quoteTemplate.sign, "PNG", 60, 220, 80);
    
    doc.AddTemplate();
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