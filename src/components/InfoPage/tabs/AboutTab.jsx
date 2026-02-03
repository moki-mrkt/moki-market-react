
const AboutTab = () => (
    <div id="about" className="info-tab active">
        <h2 className="info-title">Про нас</h2>
        <div className="text-block">
            <p>Moki — це магазин натуральних сухофруктів, горіхів і солодощів, створений із любов'ю до якості та справжнього смаку. Ми віримо, що корисне може бути смачним, а здорові перекуси — приємними та доступними кожному.</p>
            <p>У нашому асортименті — лише ретельно відібрані продукти: ароматні сухофрукти без доданого цукру, хрусткі горіхи, натуральні ласощі та східні солодощі. Ми співпрацюємо з перевіреними постачальниками, щоб гарантувати свіжість, безпечність і високу якість кожного продукту.</p>
        </div>

        <h2 className="section-subtitle">Наші переваги</h2>
        <div className="advantages-grid">
            <div className="adv-card card-1">
                <div className="adv-icon"><img src="/img/leaf.svg" alt="Quality" /></div>
                <p>Завжди якісні та свіжі продукти</p>
            </div>
            <div className="adv-card card-2">
                <div className="adv-icon"><img src="/img/truck.svg" alt="Delivery" /></div>
                <p>Безкоштовна доставка від 2000 грн</p>
            </div>
            <div className="adv-card card-1">
                <div className="adv-icon"><img src="/img/check.svg" alt="Update" /></div>
                <p>Регулярне оновлення асортименту</p>
            </div>
            <div className="adv-card card-2">
                <div className="adv-icon"><img src="/img/headset.svg" alt="Support" /></div>
                <p>Онлайн підтримка 07:00 - 21:00</p>
            </div>
        </div>

        <div className="text-block">
            <p><strong>Moki</strong> — це не просто магазин, а місце, де кожен знайде свій смак: від класичних родзинок і фініків до екзотичних фруктів і вишуканих шоколадних цукерок.</p>
            <p><strong>Обирай Moki</strong> — насолоду, яка поєднує користь природи та смак, що запам'ятовується.</p>
        </div>

        <div className="about-gallery">
            <div className="gallery-item"><img src="/img/about_1.png" alt="Dates" /></div>
            <div className="gallery-item"><img src="/img/about_2.png" alt="Mix" /></div>
            <div className="gallery-item"><img src="/img/about_3.png" alt="Nuts" /></div>
        </div>
    </div>
);

export default AboutTab;