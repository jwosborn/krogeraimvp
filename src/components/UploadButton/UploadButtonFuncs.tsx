// fileUtils.ts
import * as xlsx from 'xlsx';
import { CSVToArray } from '../../utils/format';

export const generateTableData = (arrays: any[][]): object[] => {
    const headerRow = arrays[0];
    const tableRows = arrays.slice(1);

    // convert arrays to obj with header: value
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
        // convert to table rows
        const arrays = CSVToArray(reader.result);
        //parse table rows and align rows to header
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

    reader.onload = async (e) => {
        const wb = xlsx.read(e.target.result, { type: 'array' });
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

    //Prepare DataTable
    const cols = data[0];
    data.shift();

    let _importedData = data.map(d => {
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
        // CSV workflow
        handleCSVUpload(e, setProducts);
    } else {
        handleXLSXUpload(e, setWb, setChoosingSheet, setSheet, setSheetChoices, setSheetInState);
    }
};
