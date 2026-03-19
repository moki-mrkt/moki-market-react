import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import './styles/helpers.css'
import App from './App.jsx'
import {HelmetProvider} from "react-helmet-async";

createRoot(document.getElementById('root')).render(
     <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);
