import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './Catalog.css';
import {Helmet} from "react-helmet-async";

const Catalog = () => {
    const categories = [
        { id: 1, title: 'Сухофрукти', img: '/img/categories/dry_fruits.png', link: '/catalog/dried-fruits' },
        { id: 2, title: 'Солодощі', img: '/img/categories/sweets.png', link: '/catalog/sweets' },
        { id: 3, title: 'Цукерки', img: '/img/categories/sweets.png', link: '/catalog/candies' },
        { id: 4, title: 'Горіхи', img: '/img/categories/nuts.png', link: '/catalog/nuts' },
        { id: 5, title: 'Кава', img: '/img/categories/coffee.png', link: '/catalog/coffee' },
        { id: 6, title: 'Чай', img: '/img/categories/tea.png', link: '/catalog/tea' },
        { id: 7, title: 'Суперфуд', img: '/img/categories/superfood.png', link: '/catalog/superfoods' },
        { id: 8, title: 'Олія та масла', img: '/img/categories/oils.png', link: '/catalog/oils' },
        { id: 9, title: 'Консервація', img: '/img/categories/preserves.png', link: '/catalog/preserves' },
        { id: 10, title: 'Снеки та чіпси', img: '/img/categories/snecks.png', link: '/catalog/snacks' },
        { id: 11, title: 'Спеції', img: '/img/categories/spices.png', link: '/catalog/spices' },
    ];

    return (
        <main className="hero-section">

            <Helmet>
                <title>Каталог товарів Moki Market | Горіхи, сухофрукти, солодощі та кава</title>
                <meta
                    name="description"
                    content="Перегляньте повний каталог Moki Market: горіхи, сухофрукти, кава, суперфуди та корисні снеки. Тільки якісні та свіжі продукти з доставкою по Україні."
                />
                <link rel="canonical" href="https://moki.com.ua/catalog" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="Каталог корисних продуктів Moki Market" />
                <meta property="og:description" content="Широкий вибір горіхів, сухофруктів та еко-товарів в одному місці. Обирайте найкраще для свого здоров'я!" />
                <meta property="og:url" content="https://moki.com.ua/catalog" />
                <meta property="og:image" content="https://moki.com.ua/img/icon.png" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Каталог товарів Moki Market",
                        "description": "Повний перелік категорій продуктів харчування: горіхи, насіння, солодощі, кава та інше.",
                        "url": "https://moki.com.ua/catalog"
                    })}
                </script>
            </Helmet>

            <div className="container hero__grid">

                <Breadcrumbs />

                <div className="main-catalog">
                    <h1 className="catalog-title">Каталог</h1>

                    <div className="categories">
                        {categories.map((category) => (
                            <Link to={category.link} className="category" key={category.id}>
                                <img className="category-img" src={category.img} alt={category.title} />
                                <h3 className="category-title">{category.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Catalog;