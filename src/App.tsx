import React from "react";
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DescriptionGenerator from "./components/DescriptionGenerator/DescriptionGenerator";
import KrogerIntakeForm from "./components/KrogerIntakeForm/KrogerIntakeForm";
import KrogerImageUpload from "./components/KrogerImageUpload/KrogerImageUpload";
import Header from "./components/Header/Header";
import { AuthenticationGuard } from "./components/Auth/AuthenticationGuard";
import './App.css'
import { NewLogin } from "./components/Login/NewLogin";


const App = () => {
    return (
        <>
            {/* <BrowserRouter basename='/krogeraimvp'> */}
                <Routes>
                    <Route path="/login" element={<NewLogin />} />
                    <Route path="/" element={<AuthenticationGuard component={<DescriptionGenerator />} />} />
                    <Route path='/krogeraimvp' element={<AuthenticationGuard component={<DescriptionGenerator />} />} />
                    <Route path='/kroger-intake-form' element={<AuthenticationGuard component={<KrogerIntakeForm />} />} />
                    <Route path='/kroger-image-upload' element={<><Header /><KrogerImageUpload /></>} />
                </Routes>
            {/* </BrowserRouter> */}
        </>
    )
}

export default App;