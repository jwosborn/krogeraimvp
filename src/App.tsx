import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import "./App.css";

import { Login } from './components/Login/Login';
import MainTable from './components/MainTable/MainTable';
import { UploadButton } from './components/UploadButton/UploadButton';
import { ExportButtons } from './components/ExportButtons/ExportButtons';
import { Loader } from './components/Loader/Loader';
import { RunAllButton } from './components/RunAllButton/RunAllButton';
import { DropdownSelect } from './components/DropdownSelect/DropdownSelect'

const URL = "https://kroger-description-api-0b391e779fb3.herokuapp.com/"

const logo = require('./assets/th-logo.png');
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
    const [isLogin, setIsLogin] = useState(false);
    const dt = useRef(null);

    return (
        <div className="container min-w-screen surface-ground">
            <div className="container w-11 min-h-screen mx-auto ">
                <div className="header flex flex-row justify-content-evenly w-full">
                    <img className="max-h-10rem" src={logo} alt="Thinhaus Logo" />
                    <div className="my-auto">
                        <p className="text-4xl text-primary font-main">Product Description Generator</p>
                    </div>
                </div>
                <Login
                    user={user}
                    setUser={setUser}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                />
                <Dialog className="h-12rem w-15rem" visible={choosingSheet} onHide={() => setChoosingSheet(false)}>
                    <h5>Select Sheet:</h5>
                    <DropdownSelect
                        wb={wb}
                        sheet={sheet}
                        setSheet={setSheet}
                        setChoosingSheet={setChoosingSheet}
                        setProducts={setProducts}
                        sheetChoices={sheetChoices}
                    />
                    </Dialog>
            {isLogin && (
                    <div className="flex flex-row justify-content-start border-1 border-200">
                        {!products.length &&
                            <UploadButton
                                products={products}
                                setProducts={setProducts}
                                setChoosingSheet={setChoosingSheet}
                                setSheet={setSheet}
                                setSheetChoices={setSheetChoices}
                                setWb={setWb}
                                />
                        }
                        {products.length > 0 &&
                            <>
                                <RunAllButton
                                URL={URL}
                                products={products}
                                setProducts={setProducts}
                                setLoading={setLoading}
                                setGenerated={setGenerated}
                                setError={setError}
                                />
                                <Button
                                    className="p-button-danger ml-3 my-3"
                                    icon="pi pi-ban"
                                    label="Clear Data"
                                    onClick={() => { setProducts([]); setSheet(''); setSheetChoices([]); setGenerated(false) }}
                                />
                            </>
                        }
                        <ExportButtons products={products} generated={generated} dt={dt}/>
                        {sheetChoices.length > 0 && (
                            <DropdownSelect
                                wb={wb}
                                sheet={sheet}
                                setSheet={setSheet}
                                setChoosingSheet={setChoosingSheet}
                                setProducts={setProducts}
                                sheetChoices={sheetChoices}
                            />
                        )}
                    </div>
            )}
                <MainTable
                    products={products}
                    setProducts={setProducts}
                    setLoading={setLoading}
                    setGenerated={setGenerated}
                    setError={setError}
                    dt={dt}
                />

                <Loader loading={loading} setLoading={setLoading} />

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
