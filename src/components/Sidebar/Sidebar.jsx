import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul className="sidebar-menu">
                <li><Link to="/catalog"><img src="/img/all_goods.svg" alt="all" /> <span>Всі товари</span></Link></li>
                <li><Link to="/promotions"><img src="/img/discounts.svg" alt="promo" /> <span>Акційні товари</span></Link></li>
                <li><Link to="/catalog/dried_fruits"><img src="/img/dried_fruits.svg" alt="fruits" /> <span>Сухофрукти</span></Link></li>
                <li><Link to="/catalog/nuts"><img src="/img/nuts.svg" alt="nuts" /> <span>Горіхи</span></Link></li>
                <li><Link to="/catalog/candies"><img src="/img/sweets.svg" alt="candies" /> <span>Цукерки та солодощі</span></Link></li>
                <li><Link to="/catalog/coffee"><img src="/img/coffee.svg" alt="coffee" /> <span>Кава</span></Link></li>
                <li><Link to="/catalog/tea"><img src="/img/all_goods.svg" alt="tea" /> <span>Чай</span></Link></li>
                <li><Link to="/catalog/super_food"><img src="/img/all_goods.svg" alt="super-food" /> <span>Суперфуд</span></Link></li>
                <li><Link to="/catalog/oils"><img src="/img/all_goods.svg" alt="super-food" /> <span>Олія та масла</span></Link></li>
                <li><Link to="/catalog/conservations"><img src="/img/all_goods.svg" alt="conservations" /> <span>Консервація</span></Link></li>
                <li><Link to="/catalog/snacks"><img src="/img/all_goods.svg" alt="snacks" /> <span>Снеки та чіпси</span></Link></li>
                <li><Link to="/catalog/spices"><img src="/img/all_goods.svg" alt="spices" /> <span>Спеції</span></Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;