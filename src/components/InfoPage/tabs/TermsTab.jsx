import {Helmet} from "react-helmet-async";
import React from "react";

const TermsTab = () => (
    <div id="terms" className="info-tab active">
        <Helmet>
            <title>Користувацька угода | Moki Market</title>
            <meta
                name="description"
                content="Правила та умови використання інтернет-магазину Moki Market. Ознайомтеся з нашою користувацькою угодою перед покупкою."
            />
             <meta name="robots" content="noindex, follow" />
        </Helmet>
        <h1 className="info-title">Користувацька угода</h1>
        <div className="info-card term-height"></div>
    </div>
);

export default TermsTab;