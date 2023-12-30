import React, { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { CSVToArray } from '../utils/format';
import { Button } from "primereact/button";
import { saveAs } from 'file-saver';

type ExportButtonsProps = {
    products: object[],
    generated: boolean,
    dt: React.MutableRefObject<any>,
};

export const ExportButtons = ({ products, generated, dt }: ExportButtonsProps) => {
    // const dt = useRef(null);
    
    const exportCSV: (selectionOnly: any) => void =
    (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportExcel: (productArray: any[]) => void =
    (productArray) => {
        import('xlsx').then(xlsx => {
            // bullets needs to be one string, comma separated
            let formattedProductsForXL = [...productArray];
            const worksheet = xlsx.utils.json_to_sheet(formattedProductsForXL);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'products');
        });
    }

    const saveAsExcelFile = (buffer: any, fileName: any) => {
        // Prepare data + file parameters
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
            type: EXCEL_TYPE
        })

        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    return (
        products.length > 0 && generated && (
          <>
            <Button
              className="p-button-warning ml-3 my-3"
              data-pr-tooltip="Excel"
              icon="pi pi-file-excel"
              label="Export XLSX"
              onClick={() => exportExcel(products)}
              data-testid="Export-Excel"
            />
            <Button
              type="button"
              icon="pi pi-file"
              label="Export CSV"
              onClick={() => exportCSV(false)}
              className="p-button-warning ml-3 my-3"
              data-pr-tooltip="CSV"
            />
          </>
        )
      );
} 