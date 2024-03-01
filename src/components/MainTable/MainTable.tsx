import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { generateDescriptions } from "../RunAllButton/RunAllButtonFuncs";
import { Dialog } from "primereact/dialog";
import "./MainTable.css"

type MainTableProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void,
    setError: (value: boolean) => void,
    wordLists: object,
    dt: React.MutableRefObject<any>
};

const MainTable = ({ products, setProducts, setLoading, setGenerated, setError, wordLists, dt }: MainTableProps) => {
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
        setShowDialog(true);
        setEditedValue(value);
        setEditingCell({ rowIndex, field });
    };

    const onDialogSave = () => {
        if (editedValue.trim().length > 0) {
            const newProducts = [...products];
            newProducts[editingCell.rowIndex][editingCell.field] = editedValue;
            setProducts(newProducts);
        }
        setShowDialog(false);
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={onDialogSave} autoFocus />
        </div>
    );

    const highlighter = (rowData:any = '', wordLists = {bannedWords: [''], factCheckWords: ['']}) => {
        const bannedWords = wordLists.bannedWords
        const regexBanned = new RegExp(`(${bannedWords.join('|')})`, 'gi');

        const factCheckWords = wordLists.factCheckWords
        const regexFactCheck = new RegExp(`(${factCheckWords.join('|')})`, 'gi');

        const combinedRegex = new RegExp(`(?:${regexBanned.source})|(?:${regexFactCheck.source})`, 'gi');
        const parts = rowData.split(combinedRegex).filter(part => part);
        return (
            <>
                {parts.map((part, index) => {
                    if (regexBanned.test(part)) {
                        return <span key={`${part + index}`} className="banned-highlight">{part}</span>;
                    } else if (regexFactCheck.test(part)) {
                        return <span key={`${part + index}`} className="factCheck-highlight">{part}</span>;
                    } else {
                        // If the part matches neither, return it without highlighting
                        return part;
                    }
                })}
            </>
        );
    }

    const editableCell = (rowData, index, col, lower, wordLists) => (
        <div className="edit-cell">
            {(['description', 'bullets'].includes(lower) && lower !== undefined) ? highlighter(rowData[col], wordLists) : rowData[col]}
            {rowData[col] &&
                <Button
                    icon="pi pi-pencil"
                    // className="p-button-rounded p-button-text ml-3 min-w-min contents"
                    className="edit-button"
                    onClick={() => openDialog(index, col, rowData[col])}>
                </Button>
            }
        </div>
    )


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
            if (['upc', 'product_title','descprompt', 'bulletprompt', 'description', 'bullets'].includes(lower)) {
                return (
                    <Column
                        // editor={(options) => cellEditor(options)}
                        field={col}
                        header={col}
                        showApplyButton={true}
                        onFilterApplyClick={() => null}
                        headerStyle={['description', 'bullets'].includes(lower) && {backgroundColor: '#29ABE2'}}
                        key={col}
                        onCellEditComplete={onCellEditComplete}
                        style={{ overflowWrap: 'break-word', whiteSpace: 'normal'}}
                        data-testid={`bigoltest${col}`}
                        body={lower !== 'upc'
                            ? (rowData, options) => editableCell(rowData, options.rowIndex, col, lower, wordLists)
                            : undefined
                        }
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
            style={{ width: '50vw', height: '45vw' }}
            header={editingCell.field}
            modal={true}
            footer={dialogFooter}
            onHide={() => setShowDialog(false)}
        >
            <InputTextarea
                className="p-2 w-11 mx-3"
                rows={25}
                // cols={45}
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                autoFocus
            />
        </Dialog>
    </div>
    );
};

export default MainTable;
