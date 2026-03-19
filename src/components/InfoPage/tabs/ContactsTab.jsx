const ContactsTab = () => (
    <div id="contacts" className="info-tab active">
        <h1 className="info-title">Контактна інформація</h1>
        <div className="contacts-details">
            <div className="contact-group-item">
                <h3 className="contact-label-title">Контакти</h3>
                <a href="tel:+380000000000" className="contact-link-text">+ 380 (99) 819 97 96</a>
                <a href="tel:+380000000000" className="contact-link-text">+ 380 (50) 168 96 68</a>
            </div>
            <div className="contact-group-item">
                <h3 className="contact-label-title">Електронна пошта</h3>
                <a href="mailto:moki@gmail.com" className="contact-link-text">moki.mrkt@gmail.com</a>
            </div>
            <div className="contact-group-item">
                <h3 className="contact-label-title">Графік роботи</h3>
                <p className="contact-text-value">Пн - Нд: 7:00 - 21:00</p>
            </div>
            <div className="contact-group-item">
                <h3 className="contact-label-title">Адреса</h3>
                <p className="contact-text-value">Героїв Майдану 23, Харків</p>
            </div>
        </div>

        {/*<div className="map-section">*/}
        {/*    <h2 className="map-title">Карта</h2>*/}
        {/*    <div className="map-frame">*/}
        {/*        /!* Вставте сюди iframe карти Google Maps *!/*/}
        {/*    </div>*/}
        {/*</div>*/}
    </div>
);

export default ContactsTab;