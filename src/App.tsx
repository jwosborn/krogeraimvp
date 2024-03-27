import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DescriptionGenerator from "./components/DescriptionGenerator/DescriptionGenerator";
import KrogerIntakeForm from "./components/KrogerIntakeForm/KrogerIntakeForm";
import KrogerImageUpload from "./components/KrogerImageUpload/KrogerImageUpload";
import Header from "./components/Header/Header";


const App = () => {

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL

    return (
        <>
            <BrowserRouter basename={PUBLIC_URL}>
                <Routes>
                    <Route path='/' element={<DescriptionGenerator />} />
                    <Route path='/krogeraimvp' element={<DescriptionGenerator />} />
                    <Route path='/kroger-intake-form' element={<><Header /><KrogerIntakeForm /></>} />
                    <Route path='/kroger-image-upload' element={<><Header /><KrogerImageUpload /></>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;