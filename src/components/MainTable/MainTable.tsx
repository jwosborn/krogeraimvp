import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import axios from "axios";

type MainTableProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    // isLogin: boolean,
    // setIsLogin: (value: boolean) => void
    // Loading: boolean,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void
    dt: React.MutableRefObject<any>,
};

const MainTable = ({ products, setProducts, setLoading, setGenerated, dt }: MainTableProps) => {

    const URL = "https://kroger-description-api-0b391e779fb3.herokuapp.com/"

    const rowNumber: (_: any, row: any) => number =
        (_, row) => row.rowIndex + 1

    const generateButton = (product, row) => (
        <Button
            className="p-button-success"
            icon="pi pi-refresh"
            onClick={() => generateDescription(product, row.rowIndex)}
            data-testid={`generateButton${row.rowIndex}`}
        />
    )

    const formattedAIResponse: (newProductsArr: any[], response: any) => any[] =
    (newProductsArr, response) => {
        return {
                ...newProductsArr[response.index],
                description: response.description,
                bullets: response.bullets
            }
    };

    const OpenAIResponse: (url: string, prompt: string) => Promise<Object> =
    (url: string, prompt: string) => axios.post(url, { prompt });

    const handleAIRequest:(product: any, index: number) => any =
    async (product, index) => {
        const { DescPrompt, BulletPrompt } = product;
        return OpenAIResponse(URL, DescPrompt)
            .then((descRes: any) => OpenAIResponse(URL, BulletPrompt)
                .then((bulletRes: any) => {
                    return ({
                        index,
                        description: descRes.data[0].message.content,
                        bullets: bulletRes.data[0].message.content
                    })
                })
                .catch(e => { displayAPIError(e) }) // TODO: More robust error handling
            )
    };

    const displayAPIError: (e: any) => void =
        (e) => {
            setLoading(false);
            console.error(e)
            // setErrorText(e.response.data)
        }

        const generateDescription: (product: any, index: number) => void =
        (product, index) => {
            setLoading(true);
            const { DescPrompt, BulletPrompt } = product;
            return (DescPrompt && BulletPrompt) ?
                handleAIRequest(product, index).then(res => {
                    setGenerated(true);
                    setLoading(false);
                    const newProducts = [...products]
                    newProducts[index] = formattedAIResponse(newProducts, res)
                    setProducts(newProducts);
                })
            : null
        }
      

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
