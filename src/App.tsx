import React from "react";
import { Card } from 'primereact/card';
import './App.css'
const logo = require('./assets/th-logo.png');


const App = () => {
    return (
        <>
            <div className="w-screen h-screen grid surface-200">
                <div className="w-full h-2rem">
                    <img className="max-h-13rem" src={logo} alt="Thinhaus Logo" />
                </div>
                <Card className="bg-primary zoomin animation-duration-3000 border-1 col-6 col-offset-3 font-kroger border-round-sm flex flex-column">
                    <span className="w-full">
                        <h1 className="font-main text-center">Exciting News! We've Moved!</h1>
                        <i className="pi pi-map-marker" style={{ fontSize: '15rem', color: 'green', marginLeft: '15vw' }} />
                        <h1 className="mt-5 font-kroger text-center">Find our new home at <a className="text-white" href="https://thinkhaus.app" target="blank">Thinkhaus.app</a></h1>
                        <h3 className="text-center font-kroger">
                            If you've been given access, simply sign in with your email address and password. <br/>
                            If it is your first time signing in:
                            <ul className="text-left">
                                <li>Press "forgot password"</li>
                                <li>Enter your email address.</li>
                                <li> Check your email for a link to set your password.</li>
                            </ul> If you need to be granted access, please email your Thinkhaus representative.</h3>
                    </span>
                </Card>
            </div>
        </>
    )
}

export default App;