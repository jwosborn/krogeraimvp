import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

import { CSVToArray } from './format';
import guidelines from './guidelines.json';

const logo = require('./assets/kroger-logo.png');
function App() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState(false);
    const [choosingSheet, setChoosingSheet] = useState(false);
    const [sheetChoices, setSheetChoices] = useState([]);
    const [wb, setWb] = useState({});
    const [sheet, setSheet] = useState('');
    const [AIKey, setAIKey] = useState('')
    const [AIOrg, setAIOrg] = useState('')
    const dt = useRef(null);

    const handleCSVUpload = e => {
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



    const setSheetInState = (xlsx, ws) => {
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

    const handleXLSXUpload = e => {
        import('xlsx').then(async xlsx => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const wb = xlsx.read(e.target.result, { type: 'array' });
                setWb(wb)
                const hasMultipleSheets = wb.SheetNames.length > 1;
                if (hasMultipleSheets) {
                    setChoosingSheet(true);
                    setSheetChoices(wb.SheetNames);
                } else {
                    setSheetInState(xlsx, wb.Sheets[wb.SheetNames[0]])
                }
            };

            reader.readAsArrayBuffer(e.files[0]);
        });
    }

    const handleImport = (e) => {
        const file = e.files[0];

        if (file.type === 'text/csv') {
            // CSV workflow
            handleCSVUpload(e);
            // to break func
            return
        }

        handleXLSXUpload(e)
    }

    const generateDesciptions = async () => {
        setLoading(true);
        return Promise.all(products.map((product, index) => handleAIRequest(product, index)))
            .then(async res => {
                setLoading(false);
                const newProducts = [...products];
                await res?.forEach(response => {
                    response && (
                        newProducts[response?.index] = {
                            ...newProducts[response?.index],
                            description: response?.description,
                            bullets: formatBullets(response?.bullets)
                        }
                    )
                });
                setProducts(newProducts);
                setGenerated(true);
            });
    }

    const handleAIRequest = async (product, index) => {
        return axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: generateAPIPrompt(true, product),
            max_tokens: 1000
        }, {
                headers: {
                    'Authorization': `Bearer ${AIKey}`,
                    'OpenAI-Organization': AIOrg
                }
        }
            ).then(async descriptionRes => {
                return axios.post('https://api.openai.com/v1/completions', {
                    model: 'text-davinci-003',
                    prompt: generateAPIPrompt(false, product),
                    max_tokens: 1000
                }, {
                    headers: {
                        'Authorization': `Bearer ${AIKey}`,
                        'OpenAI-Organization': AIOrg
                    }
                }
                ).then(bulletRes => {
                    return {
                        index,
                        bullets: bulletRes.data.choices[0].text,
                        description: descriptionRes.data.choices[0].text
                    }
                }).catch(() => displayAPIError());
            }).catch(() => displayAPIError());
    }

    const displayAPIError = () => {
      setLoading(false);
      setError(true);

    }

    const formatBullets = res => res.split('/end')

    const handleClear = () => {
        setGenerated(false);
    }

    const consumerSegmentInfo = (segment) => {
        return guidelines.consumerSegmentGuidelines[segment?.toLowerCase()] || []
    }

    const generateAPIPrompt = (description, product) => {
        if (product) {
            const { consumer_segment, category, Product_Title } = product;
            let prompt = 'You are a world class marketing copywriter. Write';
                // main romance description
                description && (prompt += ' a product description');
                description && (prompt += ` for ${Product_Title}. It is a ${category} product. Follow the guidelines in this list: ${guidelines.descriptionGuidelines.map(gl => gl)}`);
                (description && guidelines.categoryGuidelines[category.toLowerCase()]) && (prompt += `Also use the guidelines in this list: ${guidelines.categoryGuidelines[category.toLowerCase()]}`)
                description && (prompt += ` The target consumer is one that ${consumerSegmentInfo(consumer_segment)}. Do not use hashtags(#) or emojis. `);
                // feature bullets
                !description && (prompt += ` a bulleted list using exactly these words: ${product['Feature Bullets'] || 'NONE'}. End each bullet point with "/end"`);
            return prompt
        }
    }

    const generateTableData = (arrays) => {
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

    const bulletCell = data => typeof data.bullets === 'string' ?
        data.bullets :
     (
        <div className="flex flex-column">
            {data.bullets?.map(bp => (
                <p key={bp}>{bp}</p>
            ))}
        </div>
    )

    const columns = () => Object.keys(products[0] || {}).map(col => {
        const lower = col.toLowerCase()
        // remove image and columns with empty headers
        return (
            !lower.startsWith('feature_') &&
            !lower.startsWith('consumer') &&
            !lower.startsWith('ecommerce') &&
            !lower.startsWith('keywords')
        ) &&
            <Column
                key={col}
                field={col}
                header={col}
                headerStyle={['description', 'bullets'].includes(lower) && {backgroundColor: '#29abe2'}}
                style={{ overflowWrap: 'break-word', whiteSpace: 'normal'}}
                body={col === 'bullets' && bulletCell}
            />
    });

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            // bullets needs to be one string, comma separated
            let formattedProductsForXL = [...products];
            formattedProductsForXL = formattedProductsForXL.map(prod => ({
                ...prod,
                bullets: prod.bullets.join(', ')
            }));
            const worksheet = xlsx.utils.json_to_sheet(formattedProductsForXL);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'products');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
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

    const handleDropdownSelect = e => {
        import('xlsx').then(xlsx => {
            setSheet(e.value);
            setChoosingSheet(false);
            setSheetInState(xlsx, wb.Sheets[e.value]);
        })
    }

    return (
        <div className="container min-w-screen surface-ground">
        <div className="container w-11 min-h-screen mx-auto ">
            <div className="header flex flex-row justify-content-between w-full">
                <p className="text-5xl text-primary font-main">Product Description Generator</p>
                <img src={logo} alt="Kroger Logo" />
            </div>
            <Dialog className="h-15rem w-15rem" visible={!AIKey || !AIOrg} onHide={() => alert('Key and Org must be entered to proceed!')}>
                <span className="p-float-label mt-4 mb-5">
                    <InputText id="in" value={AIKey} onChange={(e) => setAIKey(e.target.value)} />
                    <label htmlFor="in">AIKey</label>
                </span>
                <span className="p-float-label mt-4">
                    <InputText id="in" value={AIOrg} onChange={(e) => setAIOrg(e.target.value)} />
                    <label htmlFor="in">AIOrg</label>
                </span>
            </Dialog>
            <Dialog className="h-12rem w-15rem" visible={choosingSheet} onHide={() => setChoosingSheet(false)}>
                <h5>Select Sheet:</h5>
                <Dropdown className="w-10rem" value={sheet} options={sheetChoices} onChange={handleDropdownSelect} />
            </Dialog>
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
                            label="Generate Descriptions"
                            onClick={generateDesciptions}
                        />
                        <Button
                            className="p-button-danger ml-3 mt-3"
                            icon="pi pi-ban"
                            label="Clear Data"
                            onClick={() => setProducts([])}
                        />
                    </>
                }
                {generated &&
                    <Button
                        className="p-button-danger ml-3 mt-3"
                        icon="pi pi-ban"
                        label="Clear Descriptions/Bullets"
                        onClick={handleClear}
                    />
                }
                {(products.length > 0 && generated) &&
                    <>
                        <Button
                            className="p-button-warning ml-3 mt-3"
                            data-pr-tooltip="Excel"
                            icon="pi pi-file-excel"
                            label="Export XLSX"
                            onClick={exportExcel}
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
            </div>
            <div className="max-w-screen max-h-screen">
                <DataTable
                    ref={dt}
                    className="pb-6 pt-3 mt-3 max-w-full max-h-full"
                    columnResizeMode="fit"
                    emptyMessage="Please Upload a File to Begin."
                    responsiveLayout="stack"
                    resizableColumns
                    showGridlines
                    size="small"
                    stripedRows
                    value={products}
                >
                    { columns() }
                </DataTable>
            </div>
            <Dialog className="h-12rem" header="Generating Amazing Content..." visible={loading} closable={false}>
                <ProgressSpinner className="min-w-100" />
            </Dialog>
            <Dialog className="h-12rem" header="Oops..." visible={error} closable onHide={() => setError(false)}>
                <div className="container">
                    <p className="text-primary text-4xl">Something went wrong... Please try again.</p>
                </div>
            </Dialog>
                <p>Version: 0.2</p>
        </div>
        </div>
    );
}

export default App;
