import jsPDF from "jspdf";
import "../fonts/Montserrat-Bold-normal.js";
import "../fonts/Montserrat-Regular-normal.js";
import autoTable from "jspdf-autotable";

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
        this.doc.text(text, this.margin, this.currentLine);
        this.currentLine += 16;
    }

    AddTable(headers: string[], data: string[][])
    {
        const columnStyles = {
            0: { cellWidth: this.doc.internal.pageSize.width * 0.50 }, // 66.66%
            1: { cellWidth: this.doc.internal.pageSize.width * 0.30 }  // 33.33%
        };

        const startX = this.margin
        const startY = this.currentLine; 
    
        autoTable(this.doc, {
            head: [headers],
            body: data,
            styles: { 
                fillColor: [255, 255, 255], 
                textColor: [0, 0, 0],   
                lineWidth: 0.5,             
                font: "Montserrat-Bold"     
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
        
        this.currentLine += 36;
        for (let i = 0; i < data.length; i++)
        {
            this.currentLine += 25;
        }
    }

    DownloadPdf(fileName: string)
    {
        this.doc.save(fileName);
    }
}