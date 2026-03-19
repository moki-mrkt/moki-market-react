import {Helmet} from "react-helmet-async";
import React from "react";

const PaymentTab = () => (
    <div id="payment" className="info-tab active">
        <Helmet>
            <title>Оплата та доставка | Moki Market</title>
            <meta name="description" content="Оплата та доставка | Moki Market" />
        </Helmet>
        <h1 className="info-title">Оплата та доставка</h1>
        <div className="info-cards-container">
            <div className="info-card">
                <h2 className="info-card-title">Способи доставки:</h2>
                <p className="info-card-subtitle">Відправляємо замовлення наступними службами доставки:</p>
                <div className="delivery-logos">
                    <div className="logo-item">
                        <img src="/img/nova_poshta.png" alt="Nova Poshta" className="delivery-img" />
                    </div>
                    <div className="logo-item ukr_poshta-group">
                        <img src="/img/ukr_poshta.png" alt="Ukr_poshta" className="delivery-img" />
                        <div className="logo-note">(за тарифами перевізника)</div>
                    </div>
                </div>
                <ul className="info-list">
                    <li>Доставка у відділення</li>
                    <li>Доставка у поштомат</li>
                    <li>Адреса доставка кур’єром</li>
                </ul>
                <h3 className="info-card-subtitle">Терміни доставки</h3>
                <p className="info-card-text">Зазвичай доставка займає 1-3 робочі дні з моменту підтвердження замовлення.</p>
                <p className="info-card-text">Замовлення, оформлені до 15:00, відправляються того ж дня.</p>
            </div>

            <div className="info-card">
                <h2 className="info-card-title">Способи оплати:</h2>
                <p className="info-card-text margin-bottom-small">Оплатити замовлення можливо:</p>
                <p className="info-card-text">
                    При отриманні на відділенні обраної служби доставки<br />
                    На карту ПриватБанк.<br />
                    На карту МоноБанк.<br />
                    Ми повідомимо номер карти після того, як менеджер підтвердить ваше замовлення.
                </p>
                <p className="info-card-text margin-top-medium">
                    - Накладений платіж через сервіс доставки "Нова Пошта"
                </p>
                <p className="info-card-text">
                    Післяплата: можливість оплати при отриманні (комісія 2% + 20 грн за переказ коштів Новою Поштою).
                </p>
            </div>
        </div>
    </div>
);

export default PaymentTab;