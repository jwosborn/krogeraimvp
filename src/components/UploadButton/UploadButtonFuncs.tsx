// fileUtils.ts
import * as xlsx from 'xlsx';
import { CSVToArray } from '../../utils/format';

export const generateTableData = (arrays: any[][]): any[] => {
    const headerRow = arrays[0];
    const tableRows = arrays.slice(1);

    return tableRows.map(row => {
        let obj: any = {};
        row.forEach((val, idx) => {
            obj = {
                ...obj,
                [headerRow[idx]]: val
            };
        });
        return obj;
    });
};

export const handleCSVUpload = (e: any, setProducts: Function): void => {
    const reader = new FileReader();
    reader.onload = () => {
        const arrays = CSVToArray(reader.result);
        const table = generateTableData(arrays);
        setProducts(table.slice(1));
    };

    reader.readAsBinaryString(e.files[0]);
};

export const handleXLSXUpload = async (
    e: any,
    setWb: Function,
    setChoosingSheet: Function,
    setSheet: Function,
    setSheetChoices: Function,
    setSheetInState: Function
): Promise<void> => {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const wb = xlsx.read(event.target.result, { type: 'array' });
        setWb(wb);

        const hasMultipleSheets = wb.SheetNames.length > 1;
        if (hasMultipleSheets) {
            setChoosingSheet(true);
            setSheet('');
            setSheetChoices(wb.SheetNames);
        } else {
            setSheetInState(xlsx, wb.Sheets[wb.SheetNames[0]]);
        }
    };

    reader.readAsArrayBuffer(e.files[0]);
};

export const setSheetInState = (xlsx: any, ws: any, setProducts: Function): void => {
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    const cols = data[0];
    data.shift();

    const _importedData = data.map(d => {
        return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
        }, {});
    });
    setProducts(_importedData);
};

export const handleImport = (e: any, setProducts: Function, setWb: Function, setChoosingSheet: Function, setSheet: Function, setSheetChoices: Function): void => {
    const file = e.files[0];

    if (file.type === 'text/csv') {
        handleCSVUpload(e, setProducts);
    } else {
        handleXLSXUpload(e, setWb, setChoosingSheet, setSheet, setSheetChoices, setSheetInState);
    }
};
