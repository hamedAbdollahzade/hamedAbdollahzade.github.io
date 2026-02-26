import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import './styles/tailwind.css';
import './styles/rtl.css';
import './i18n/config';
import {LanguageProvider} from "@/contexts/LanguageContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <App/>
        </LanguageProvider>
    </React.StrictMode>
);
