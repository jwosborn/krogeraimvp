import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import axios from "axios";
import { generateDescriptions } from "../RunAllButton/RunAllButtonFuncs";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import 'primeicons/primeicons.css';

type MainTableProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void,
    setError: (value: boolean) => void,
    dt: React.MutableRefObject<any>
};

const MainTable = ({ products, setProducts, setLoading, setGenerated, setError, dt }: MainTableProps) => {
    const [showDialog, setShowDialog] = useState(false);
    const [editedValue, setEditedValue] = useState('');
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });

    const URL = "https://kroger-description-api-0b391e779fb3.herokuapp.com/"

    const rowNumber: (_: any, row: any) => number =
        (_, row) => row.rowIndex + 1

    const generateButton = (product, row) => (
        <Button
            className="p-button-success"
            icon="pi pi-refresh"
            // onClick={() => generateDescription(product, row.rowIndex)}
            onClick={() => generateDescriptions(products, setLoading, setProducts, URL, setGenerated, setError, row.rowIndex)}
            data-testid={`generateButton${row.rowIndex}`}
        />
    )

    const onCellEditComplete = (e) => {
        let { rowIndex, newValue, field, originalEvent: event } = e;
        if (newValue?.trim().length > 0) {
            const newProducts = [...products];
            newProducts[rowIndex][field] = newValue;
            setProducts(newProducts);
        } else {
            event.preventDefault();
        }
    }

    const openDialog = (rowIndex, field, value) => {
        if(field != "UPC"){
            setShowDialog(true);
            setEditedValue(value);
            setEditingCell({ rowIndex, field });
        }
    };

    const onDialogSave = () => {
        if (editedValue.trim().length > 0) {
            const newProducts = [...products];
            newProducts[editingCell.rowIndex][editingCell.field] = editedValue;
            setProducts(newProducts);
        }
        setShowDialog(false);
    };

    const cellEditor = (options) => {
        return (
            <div onClick={() => openDialog(options.rowIndex, options.field, options.value)}>
                {options.value}
            </div>
        );
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={onDialogSave} autoFocus />
        </div>
    );
    
    const columns: (productArray: any[]) => React.ReactElement[] | null =
    (productArray) => {
        // Getting all unique keys from each product
        const allKeys = new Set<string>();
        productArray.forEach(product => {
            Object.keys(product).forEach(key => allKeys.add(key));
        });
    
        // Mapping over unique keys to create columns
        return Array.from(allKeys).map(col => {
            const lower = col.toLowerCase();
            if (['upc', 'product_title', 'description', 'bullets'].includes(lower)) {
                return (
                    <Column
                        editor={(options) => cellEditor(options)}
                        field={col}
                        header={col}
                        showApplyButton={true}
                        onFilterApplyClick={() => null}
                        headerStyle={['description', 'bullets'].includes(lower) && {backgroundColor: '#29abe2'}}
                        key={col}
                        onCellEditComplete={onCellEditComplete}
                        style={{ overflowWrap: 'break-word', whiteSpace: 'normal'}}
                        data-testid={`bigoltest${col}`}
                    />
                );
            }
            return null;
        });
    };

    return (
    <div>  
        <DataTable
            ref={dt}
            className="pb-6 pt-3 mt-3 max-w-full max-h-full"
            columnResizeMode="fit"
            emptyMessage="Please Upload a File to Begin."
            responsiveLayout="stack"
            resizableColumns
            showGridlines
            scrollable
            scrollHeight="65vh"
            size="small"
            stripedRows
            value={products}
        >
            <Column field="Index" header="#" body={rowNumber}/>
            { columns(products) }
            {Boolean(products.length) && <Column header="Run" body={generateButton} />}
        </DataTable>

        <Dialog 
            className="f"
            visible={showDialog} 
            style={{ width: '50vw' }} 
            header={editingCell.field}
            modal={true}
            footer={dialogFooter} 
            onHide={() => setShowDialog(false)}
        >
            <InputTextarea 
                rows={5}
                cols={30}
                value={editedValue} 
                onChange={(e) => setEditedValue(e.target.value)} 
                autoFocus 
            />
        </Dialog>
    </div>   
    );
};

export default MainTable;
