import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import axios from "axios";
import { generateDescriptions } from "../RunAllButton/RunAllButtonFuncs";

type MainTableProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void,
    setError: (value: boolean) => void,
    dt: React.MutableRefObject<any>
};

const MainTable = ({ products, setProducts, setLoading, setGenerated, setError, dt }: MainTableProps) => {

    const URL = "https://kroger-description-api-0b391e779fb3.herokuapp.com/"

    const rowNumber: (_: any, row: any) => number =
        (_, row) => row.rowIndex + 1

    const generateButton = (product, row) => (
        <Button
            className="p-button-success"
            icon="pi pi-refresh"
            // onClick={() => generateDescription(product, row.rowIndex)}
            onClick={() => generateDescriptions([product], setLoading, setProducts, URL, setGenerated, setError)}
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

    const cellEditor = (options) => {
        return <InputTextarea className="h-30rem w-12" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} data-testid={'editCell'} />;
    }

    const columns: (productArray: any[]) => React.ReactElement[] | null =
    (productArray) => Object.keys(productArray[0] || {}).map(col => {
        const lower = col.toLowerCase()
        if (['upc', 'product_title', 'description', 'bullets'].includes(lower)) {
            return (
                <Column
                    editor={(options) => cellEditor(options)}
                    field={col}
                    header={col}
                    headerStyle={['description', 'bullets'].includes(lower) && {backgroundColor: '#29abe2'}}
                    key={col}
                    onCellEditComplete={onCellEditComplete}
                    style={{ overflowWrap: 'break-word', whiteSpace: 'normal'}}
                    data-testid={`bigoltest${col}`}
                />
            )
        }
        return null
    });


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
    </div>   

    );
};

export default MainTable;
