import jsPDF from "jspdf";
import "../fonts/Montserrat-Bold-normal.js";
import "../fonts/Montserrat-Regular-normal.js";
import autoTable from "jspdf-autotable";
import { quoteTemplate } from "../assets/pdfImages.js";

export class PdfProvider 
{
    doc: jsPDF;
    margin: number;
    font: string;
    currentLine: number;

    constructor()
    {
        this.doc = this.CreateNewPdf();
        this.margin = 0;
        this.font = "";
        this.currentLine = 120;
    }

    private CreateNewPdf()
    {
        const doc = new jsPDF("p", "pt");
        doc.setFontSize(11);
        return doc;
    }

    SetMargin(margin: number)
    {
        this.margin = margin;
    }

    AddImage(image: string, format: string, x: number, y: number, width: number, height: number)
    {
        if (width === 0)
        {
            width = this.doc.internal.pageSize.getWidth()
        }

        this.doc.addImage(image, format, x, y, width, height);
    }

    AddSign(image: string, format: string, x: number, width: number, height: number)
    {
        if (width === 0)
        {
            width = this.doc.internal.pageSize.getWidth()
        }

        this.doc.addImage(image, format, x, this.currentLine, width, height);
    }

    SetFont(font: string)
    {
        this.font = font;
    }

    SetTextColor(r: number, g: number, b: number)
    {
        this.doc.setTextColor(r, g, b);
    }

    AddHeader6(text: string, color?: string)
    {
        if(color === "white")
        {
            this.doc.setTextColor(255, 255, 255);
        } 

        this.doc.setFont("Montserrat-Bold", "normal");
        this.doc.text(text, this.margin, this.currentLine);
        this.doc.setFont("Montserrat-Regular", "normal");
        this.currentLine += 16;
        this.doc.setTextColor(0, 0, 0);
    }

    AddBlankLines(lines: number)
    {
        this.currentLine += lines * 16;
    }

    AddLine(text: string)
    {
        if (this.currentLine + 60 > 768) {
            this.doc.addPage(); // Add a new page if there's not enough space
            this.currentLine = 120;
        }
        this.doc.text(text, this.margin, this.currentLine);
        this.currentLine += 16;
    }

    AddLineTab(text: string, value: string)
    {
        if (this.currentLine + 60 > 768) {
            this.doc.addPage(); // Add a new page if there's not enough space
            this.currentLine = 120;
        }
        this.doc.text(text, this.margin, this.currentLine);
        this.doc.text(value, this.margin + 140, this.currentLine);
        this.currentLine += 16;
    }

    AddTable(headers: Cell[], data: string[][], rowHeights?: number[], products?: Product[])
    {
        const columnStyles = Array.from(headers).reduce((acc: any, cell, index) => {
            acc[index] = { cellWidth: this.doc.internal.pageSize.width * cell.width };
            return acc;
        }, {});

        const startX = this.margin
        const startY = this.currentLine; 
    
        autoTable(this.doc, {
            head: [headers.map(header => header.text)],
            body: data,
            styles: { 
                fillColor: [255, 255, 255], 
                textColor: [0, 0, 0],   
                lineWidth: 0.5,             
                font: "Montserrat-Bold"     
            },
            didParseCell: function (data) {
                if (data.section === 'body') {
                    const rowIndex = data.row.index;
                    
                    if (rowHeights && rowIndex < rowHeights.length) {
                        data.cell.styles.minCellHeight = rowHeights[rowIndex];
                    }
                }
            },
            willDrawCell: (data) => {
                if (data.section === 'body') {
                    const rowIndex = data.row.index;
                    const remainingPageSpace = 760 - data.cell.y - 60;
                    
                    if (remainingPageSpace < data.row.height) {
                        this.doc.addPage(); 
                        data.cell.y = 120;
                        if(data.cursor) data.cursor.y = 120;
                    }

                    if(products) this.addImage(data.cell.y, products[rowIndex]);
                }
            },
            headStyles: { 
                fillColor: [211, 211, 211], 
                textColor: [112, 112, 112] ,
                lineWidth: 0.5,             
                font: "Montserrat-Bold"   
            },
            columnStyles: columnStyles,
            startY: startY,
            margin: { left: startX, right: startX },
        });
        
    }

    AddTemplate(){
        const pageCount = this.doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            this.doc.setPage(i); // Set the page where to add the image
            this.doc.addImage(quoteTemplate.header, "PNG", 0, 0, 0, 75);
            this.doc.addImage(quoteTemplate.footer, "PNG", 0, 768, 0, 90);
        }
    }

    addImage(y:number, product: Product){
        let rowHeight = 0; 
        
        if (product.image) {
            const xPosition = 240;
            const yPosition = y + rowHeight; 
            rowHeight += product.image.height;
            this.doc.addImage(product.image.base64String, "PNG", xPosition, yPosition, 117, product.image.height); // Adjust the dimensions
            this.currentLine = (yPosition + product.image.height) + 20;
        }

    }

    DownloadPdf(fileName: string)
    {
        this.doc.save(fileName);
    }
}