import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";

type DropdownSelectProps = {
    wb: object,
    sheet: string,
    setSheet: (value: string) => void,
    setChoosingSheet: (value: boolean) => void,
    setProducts: (value: object[]) => void,
    sheetChoices: any[],
};



export const DropdownSelect = ({ wb, sheet, setSheet, setChoosingSheet, setProducts, sheetChoices }: DropdownSelectProps) => {

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

    const handleDropdownSelect: (e: any, workbook: any) => void =
    (e, workbook) => {
        import('xlsx').then(xlsx => {
            setSheet(e.value);
            setChoosingSheet(false);
            setSheetInState(xlsx, workbook.Sheets[e.value]);
        })
    }

    return (
        <>
            <Dropdown 
                className="ml-5 my-3" 
                value={sheet} 
                options={sheetChoices} 
                onChange={e => handleDropdownSelect(e, wb)} 
            />
        </>
)};