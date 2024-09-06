import { getLastMonth, getSpanishFormattedDate } from "../../../shared/services/dateUtils";
import { pdfImages } from "../../pdf/assets/pdfImages";
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
        ["SERVICIO", "VALOR"],
        [
            ...invoice.services.map(service => [service.name, `$${addThousandSeparator(service.value)} COP`]),
            ["Total a pagar", `$${addThousandSeparator(invoice.services.reduce((acc, curr) => acc + curr.value, 0))} COP`]
        ]
    );

    function addThousandSeparator(value: number): string {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    doc.SetTextColor(135, 135, 135);
    doc.AddLine('Declaro voluntariamente y bajo la gravedad de juramento, que pertenezco al');
    doc.AddLine('régimen simplificado, por lo tanto, de acuerdo al Art 42 del Decreto 3541 de 1983 y');
    doc.AddLine('Art 511 del ET, no estoy obligado a expedir factura de venta');
    doc.SetTextColor(0, 0, 0);

    doc.AddBlankLines(4);
    doc.AddLine("Cordialmente");
    doc.AddImage(pdfImages.sign, "PNG", 40, 598, 120, 80);
    doc.AddBlankLines(6);
    doc.AddLine("Tomás Parra Monroy");
    doc.AddLine("CC 1.001.098.088");
    doc.DownloadPdf(`Cuenta de cobro ${invoice.company} ${getSpanishFormattedDate()}.pdf`);
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