import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DescriptionGenerator from "./components/DescriptionGenerator/DescriptionGenerator";
import KrogerIntakeForm from "./components/KrogerIntakeForm/KrogerIntakeForm";
import KrogerImageUpload from "./components/KrogerImageUpload/KrogerImageUpload";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<DescriptionGenerator />} />
                <Route path='/krogeraimvp' element={<DescriptionGenerator />} />
                <Route path='/kroger-intake-form' element={<KrogerIntakeForm />} />
                <Route path='/kroger-image-upload' element={<KrogerImageUpload />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;