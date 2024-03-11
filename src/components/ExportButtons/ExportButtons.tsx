import React, { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { CSVToArray } from '../../utils/format';
import { Button } from "primereact/button";
import { saveAs } from 'file-saver';
import axios from "axios";

type ExportButtonsProps = {
    products: object[],
    generated: boolean,
    wordLists: object,
    URL: string,
    dt: React.MutableRefObject<any>,
};

export const ExportButtons = ({ products, generated, wordLists, URL, dt }: ExportButtonsProps) => {
      
    const exportCSV: (selectionOnly: any) => void =
    (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const sendExport = async (productsArray, wordLists) => {
      try {
        const response = await axios.post(URL + "download-excel", {productsArray, wordLists}, {
          responseType: 'blob'
        });
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const fileName = 'products ' + '_export_' + new Date().getTime() + '.xlsx';
        saveAs(blob, fileName); 
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    };

    return (
        products.length > 0 && generated && (
          <>
            <Button
              className="p-button-warning ml-3 my-3"
              data-pr-tooltip="Excel"
              icon="pi pi-file-excel"
              label="Export XLSX"
              onClick={async () => sendExport(products, wordLists)}
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