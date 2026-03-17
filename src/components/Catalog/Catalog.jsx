import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './Catalog.css';

const Catalog = () => {
    const categories = [
        { id: 1, title: 'Сухофрукти', img: '/img/categories/dry_fruits.png', link: '/catalog/dried-fruits' },
        { id: 2, title: 'Солодощі', img: '/img/categories/sweets.png', link: '/catalog/sweets' },
        { id: 3, title: 'Горіхи', img: '/img/categories/nuts.png', link: '/catalog/nuts' },
        { id: 4, title: 'Кава', img: '/img/categories/coffee.png', link: '/catalog/coffee' },
        { id: 5, title: 'Чай', img: '/img/categories/tea.png', link: '/catalog/tea' },
        { id: 6, title: 'Суперфуд', img: '/img/categories/superfood.png', link: '/catalog/super-food' },
        { id: 7, title: 'Олія та масла', img: '/img/categories/oils.png', link: '/catalog/oils' },
        { id: 8, title: 'Консервація', img: '/img/categories/conservation.png', link: '/catalog/conservation' },
        { id: 9, title: 'Снеки та чіпси', img: '/img/categories/snecks.png', link: '/catalog/snacks' },
        { id: 10, title: 'Спеції', img: '/img/categories/spices.png', link: '/catalog/spices' },
    ];

    return (
        <main className="hero-section">
            <div className="container hero__grid">

                <Breadcrumbs />

                <div className="main-catalog">
                    <h2 className="catalog-title">Каталог</h2>

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