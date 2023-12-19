import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';

import { CSVToArray } from './format';

const URL = "https://kroger-description-api-0b391e779fb3.herokuapp.com/"

const logo = require('./assets/kroger-logo.png');
function App() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState(false);
    // const [errorText, setErrorText] = useState('');
    const [choosingSheet, setChoosingSheet] = useState(false);
    const [sheetChoices, setSheetChoices] = useState([]);
    const [wb, setWb] = useState({});
    const [sheet, setSheet] = useState('');
    const [user, setUser] = useState('');
    const dt = useRef(null);

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

    const formattedAIResponse: (newProductsArr: any[], response: any) => any[] =
    (newProductsArr, response) => {
        return {
                ...newProductsArr[response.index],
                description: response.description,
                bullets: response.bullets
            }
    };

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

    const generateDesciptions:  (productArray: any[]) => Promise<void> =
    async (productArray) => {
        setLoading(true);
        return Promise.allSettled(productArray.map((product, index) => {
            if (product.DescPrompt && product.BulletPrompt) {
                return handleAIRequest(product, index)
            }
            return null
        }))
        .then(async (res: any) => {
            setLoading(false);
            let newProducts = [...productArray];
            // return array of arrays bc formattedAIResponse returns an array each time
            // need to just add the products to the array then set that array in state once that's all done.
            await res?.forEach(response => {
                newProducts[response.value.index] = formattedAIResponse(newProducts, response.value);
            });
            console.log(newProducts)
            setProducts(newProducts);
            setGenerated(true);
        }).catch(e => { console.log({failed: e})});
    }

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
                .catch(e => { displayAPIError(e) })
            )
    };

    const displayAPIError: (e: any) => void =
    (e) => {
        setLoading(false);
        setError(true);
        console.error(e)
        // setErrorText(e.response.data)
    }

    // const handleClear = () => {
    //     setGenerated(false);
        // need func to remove desc/bullets from each prod
    // }

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

    const cellEditor = (options) => {
        return <InputTextarea className="h-30rem w-12" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const onCellEditComplete = (e) => {
        let { rowIndex, newValue, field, originalEvent: event } = e;

        if (newValue.trim().length > 0) {
            // rowData[field] = newValue;
            const newProducts = [...products];
            newProducts[rowIndex][field] = newValue;
            setProducts(newProducts);
        } else {
            event.preventDefault();
        }
    }

    const columns: (productArray: any[]) => React.ReactElement[] | null =
    (productArray) => Object.keys(productArray[0] || {}).map(col => {
        const lower = col.toLowerCase()
        if (['descprompt', 'upc', 'bulletprompt', 'product_title', 'description', 'bullets'].includes(lower)) {
            return (
                <Column
                    editor={(options) => cellEditor(options)}
                    field={col}
                    header={col}
                    headerStyle={['description', 'bullets'].includes(lower) && {backgroundColor: '#29abe2'}}
                    key={col}
                    onCellEditComplete={onCellEditComplete}
                    style={{ overflowWrap: 'break-word', whiteSpace: 'normal'}}
                />
            )
        }
        return null
    });

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

    const saveAsExcelFile: (buffer: any, fileName: any) => void =
    (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }

    const handleDropdownSelect: (e: any, workbook: any) => void =
    (e, workbook) => {
        import('xlsx').then(xlsx => {
            setSheet(e.value);
            setChoosingSheet(false);
            setSheetInState(xlsx, workbook.Sheets[e.value]);
        })
    }

    const rowNumber: (_: any, row: any) => number =
    (_, row) => row.rowIndex + 1

    const generateButton = (product, row) => (
        <Button
            className="p-button-success"
            icon="pi pi-refresh"
            onClick={() => generateDescription(product, row.rowIndex)}
        />
    )

    return (
        <div className="container min-w-screen surface-ground p-7">
            <div className="container w-11 min-h-screen mx-auto ">
                <div className="header flex flex-row justify-content-between w-full">
                    <p className="text-5xl text-primary font-main">Product Description Generator</p>
                    <img src={logo} alt="Kroger Logo" />
                </div>
                <Dialog className="h-10rem w-15rem" visible={user.toLowerCase() !== 'meaghan'} onHide={() => alert('Correct user must be entered to proceed!')}>
                    <span className="p-float-label mt-4">
                        <InputText id="in" value={user} onChange={(e) => setUser(e.target.value)} />
                        <label htmlFor="in">Enter User</label>
                    </span>
                </Dialog>
                <Dialog className="h-12rem w-15rem" visible={choosingSheet} onHide={() => setChoosingSheet(false)}>
                    <h5>Select Sheet:</h5>
                    <Dropdown className="w-10rem" value={sheet} options={sheetChoices} onChange={e => handleDropdownSelect(e, wb)} />
                </Dialog>
            {user.toLowerCase() === 'meaghan' && (
                    <div className="flex flex-row justify-content-start">
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
                            />
                        }
                        {products.length > 0 &&
                            <>
                                <Button
                                    className="p-button-primary generate-button mt-3 ml-3"
                                    icon="pi pi-check"
                                    label="Run All Descriptions"
                                    onClick={() => generateDesciptions(products)}
                                />
                                <Button
                                    className="p-button-danger ml-3 mt-3"
                                    icon="pi pi-ban"
                                    label="Clear Data"
                                    onClick={() => { setProducts([]); setSheet(''); setSheetChoices([]); }}
                                />
                            </>
                        }
                        {/* {generated &&
                            <Button
                                className="p-button-danger ml-3 mt-3"
                                icon="pi pi-ban"
                                label="Clear Descriptions/Bullets"
                                onClick={handleClear}
                            />
                        } */}
                        {(products.length > 0 && generated) &&
                            <>
                                <Button
                                    className="p-button-warning ml-3 mt-3"
                                    data-pr-tooltip="Excel"
                                    icon="pi pi-file-excel"
                                    label="Export XLSX"
                                    onClick={() => exportExcel(products)}
                                />
                                <Button
                                    type="button"
                                    icon="pi pi-file"
                                    label="Export CSV"
                                    onClick={() => exportCSV(false)}
                                    className="p-button-warning ml-3 mt-3"
                                    data-pr-tooltip="CSV"
                                />
                            </>
                        }
                        {sheetChoices.length > 0 && (
                            <Dropdown
                                className="ml-5 mt-3"
                                options={sheetChoices}
                                value={sheet}
                                onChange={(e) => handleDropdownSelect(e, wb)}
                            />
                        )}
                    </div>
            )}
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
                    <Dialog className="h-12rem" header="Generating Amazing Content..." visible={loading} closable={false} onHide={() => setLoading(false)}>
                        <ProgressSpinner className="min-w-100" />
                    </Dialog>
                    <Dialog className="h-12rem" header="Oops..." visible={error} closable onHide={() => setError(false)}>
                        <div className="container">
                            <p className="text-primary text-4xl">Something went wrong... Please try again.</p>
                            {/* <p className="text-primary text-4xl">{errorText}</p> */}
                        </div>
                    </Dialog>
                    <p>Version: 1.0.1</p>
                </div>
        </div>
    );
}

export default App;
