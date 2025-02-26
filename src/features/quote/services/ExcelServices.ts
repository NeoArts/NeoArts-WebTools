import React from 'react';
import fileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToExcel = ({ data, fileName } : any) => {
    // Define the custom headers and specify the exact keys for each field in the data
    const customHeaders = [
        'Id', 'Artículo', 'Descuento Proveedor', 'Precio con descuento', 'Costo Total', 
        'Precio de venta', 'Valor total', 'Tipo de marca', 'Proveedor', 'Costo', 
        'Cantidad', 'Costo de marca', 'Otros costos', 'Rentabilidad', 'Imagen'
    ];

    // Transform data into an array format that matches the custom headers
    const transformedData = data.map((item: Product) => (
        {
            'Id': item.id,
            'Artículo': item.name,
            'Descuento Proveedor': item.providerDiscount,
            'Precio con descuento': item.providerDiscount,
            'Costo Total': item.totalCost,
            'Precio de venta': item.sellPrice,
            'Valor total': item.totalValue,
            'Tipo de marca': item.markType,
            'Proveedor': item.provider,
            'Costo': item.cost,
            'Cantidad': item.quantity,
            'Costo de marca': item.markType,
            'Otros costos': item.otherCost,
            'Rentabilidad': item.profit,
            'Imagen': item.image
        }
    ));
    console.log('data', data);
    console.log('transformedData', transformedData);
    // Create worksheet from transformed data
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Set column widths and hide specific columns
    const columnWidths = customHeaders.map(() => ({ wch: 20 })); // Set width for each column
    worksheet['!cols'] = columnWidths;
    worksheet['!cols'][0] = { hidden: true };  // Hide column A (first column)
    worksheet['!cols'][14] = { hidden: true }; // Hide column O (last column)

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel buffer and save file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    fileSaver.saveAs(blob, `${fileName}.xlsx`);
};
