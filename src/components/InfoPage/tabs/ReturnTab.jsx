import {Helmet} from "react-helmet-async";
import React from "react";

const ReturnTab = () => (
    <div id="return" className="info-tab active">
        <Helmet>
            <title>Обмін та повернення | Moki Market</title>
            <meta name="description" content="Обмін та повернення | Moki Market" />
        </Helmet>
        <h1 className="info-title">Обмін та повернення</h1>
        <div className="info-card">
            <h2 className="info-card-subtitle">Гарантія якості та умови повернення</h2>
            <p className="info-card-text">Ми ретельно перевіряємо кожне замовлення перед відправкою, а також контролюємо якість та свіжість товарів при отриманні від постачальників. Наша мета — щоб ви отримали продукт, який повністю відповідає опису та вашим очікуванням.</p>
            <p className="info-card-text">Оскільки ми працюємо з натуральними продуктами, іноді трапляються непередбачувані ситуації. Проте ми завжди на боці клієнта і вирішуємо будь-які питання в індивідуальному порядку.</p>

            <div>
                <h3 className="info-card-subtitle">Важливо при отриманні</h3>
                <ul className="info-list">
                    <li>Будь ласка, <strong>забирайте посилки якомога швидше</strong>, особливо в спекотну пору року (сухофрукти та солодощі чутливі до температур).</li>
                    <li>Обов’язково <strong>перевіряйте цілісність та стан товару</strong> безпосередньо у відділенні пошти.</li>
                </ul>
            </div>

            <h3 className="info-card-subtitle">Повернення товару неналежної якості</h3>
            <p className="info-card-text">Якщо ви виявили, що продукт зіпсований, непридатний до вживання або втратив свої харчові властивості:</p>
            <ol className="info-list">
                <li>Повідомте нам про це якнайшвидше.</li>
                <li>Ми здійснимо <strong>заміну товару</strong> (доставка за наш рахунок) або зробимо <strong>повне повернення коштів</strong>.</li>
                <li>Телефон для вирішення питань обміну та повернення: <a href="tel:+380950460363" className="phone-link">(099) 819 97 96</a>.</li>
            </ol>

            <h3 className="info-card-subtitle">Повернення товару належної якості</h3>
            <p className="info-card-text">Зверніть увагу, що відповідно до ст. 13, 14, 20 Закону України «Про захист прав споживачів», <strong>продукти харчування належної якості поверненню та обміну не підлягають</strong>.</p>
        </div>
    </div>
);

export default ReturnTab;