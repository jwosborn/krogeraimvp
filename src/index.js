import React from 'react';
import ReactDOM from 'react-dom/client'
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "./utils/theme.css";
import App from './App';
import reportWebVitals from './utils/reportWebVitals';
import 'primeicons/primeicons.css';
import { AuthProvider } from './context/AuthProvider';
import { Auth0ProviderWithNavigate } from './components/Auth/Auth0ProviderWithNavigate.tsx';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Auth0ProviderWithNavigate>
            <App />
        </Auth0ProviderWithNavigate>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
