import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { CSVToArray } from '../utils/format';

type UploadButtonProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    setChoosingSheet: (value: boolean) => void,
    setSheet: (value: string) => void,
    setSheetChoices: (value: string[]) => void,
    setWb: (value: object) => void
};

export const UploadButton = ({ products, setProducts, setChoosingSheet, setSheet, setSheetChoices, setWb }: UploadButtonProps) => {

    const generateTableData: (arrays: [][]) => object[] =
    arrays => {
        const headerRow = arrays[0];
        const tableRows = arrays.slice(1)

        // convert arrays to obj with header: value
        return tableRows.map(row => {
            let obj = {};
            row.forEach((val, idx) => {
                 obj = {
                    ...obj,
                    [headerRow[idx]]: val
                }
            });
            return obj;
        })
    }

    const handleCSVUpload: (e: any) => void =
    e => {
        const reader = new FileReader();
        reader.onload = () => {
            // convert to table rows
            const arrays = CSVToArray(reader.result);
            //parse table rows and align rows to header
            const table = generateTableData(arrays);
            setProducts(table.slice(1))
        };
        // start reading the file. When it is done, calls the onload event defined above.
        // @ts-ignore
        reader.readAsBinaryString(e.files[0]);
    }

    const handleXLSXUpload: (e: any) => void =
    e => {
        import('xlsx').then(async xlsx => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const wb = xlsx.read(e.target.result, { type: 'array' });
                setWb(wb)
                const hasMultipleSheets = wb.SheetNames.length > 1;
                if (hasMultipleSheets) {
                    setChoosingSheet(true);
                    setSheet('')
                    setSheetChoices(wb.SheetNames);
                } else {
                    setSheetInState(xlsx, wb.Sheets[wb.SheetNames[0]])
                }
            };

            reader.readAsArrayBuffer(e.files[0]);
        });
    }

    const setSheetInState: (xlsx: any, ws: any) => void =
    (xlsx, ws) => {
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // Prepare DataTable
        const cols = data[0];
        data.shift();

        let _importedData = data.map(d => {
            return cols.reduce((obj, c, i) => {
                obj[c] = d[i];
                return obj;
            }, {});
        });

        setProducts(_importedData)
    }

    const handleImport: (e: any) => void =
    (e) => {
        const file = e.files[0];

        if (file.type === 'text/csv') {
            // CSV workflow
            handleCSVUpload(e);
            // to break func
            return
        }

        handleXLSXUpload(e)
    }

    return (
        <>
        {!products.length &&
        <FileUpload
            accept=".xlsx, .csv"
            auto
            className="mt-3"
            customUpload
            chooseLabel="Browse Files"
            mode="basic"
            uploadLabel="Upload Excel File"
            uploadHandler={handleImport}
        />}
        </>
    )};