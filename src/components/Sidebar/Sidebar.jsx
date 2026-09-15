import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import {useTranslation} from "react-i18next";

const Sidebar = () => {

    const { t, i18n } = useTranslation();

    return (
        <aside className="sidebar">
            <ul className="sidebar-menu">
                <li><Link to="/catalog"><img src="/img/all_goods.svg" alt="all" /> <span>{t('category.all')}</span></Link></li>
                <li><Link to="/promotions"><img src="/img/discounts.svg" alt="promo" /> <span>{t('category.sales')}</span></Link></li>
                <li><Link to="/catalog/dried-fruits"><img src="/img/dried_fruits.svg" alt="dried-fruits" /> <span>{t('category.dry-fruit')}</span></Link></li>
                <li><Link to="/catalog/nuts"><img src="/img/nuts.svg" alt="nuts" /> <span>{t('category.nuts')}</span></Link></li>
                <li><Link to="/catalog/sweets"><img src="/img/sweets.svg" alt="sweets" /> <span>{t('category.sweets')}</span></Link></li>
                <li><Link to="/catalog/candies"><img src="/img/sweets.svg" alt="candies" /> <span>{t('category.candies')}</span></Link></li>
                <li><Link to="/catalog/coffee"><img src="/img/coffee.svg" alt="coffee" /> <span>{t('category.coffee')}</span></Link></li>
                <li><Link to="/catalog/tea"><img src="/img/all_goods.svg" alt="tea" /> <span>{t('category.tea')}</span></Link></li>
                <li><Link to="/catalog/superfoods"><img src="/img/all_goods.svg" alt="superfoods" /> <span>{t('category.superfoods')}</span></Link></li>
                <li><Link to="/catalog/oils"><img src="/img/all_goods.svg" alt="oils" /> <span>{t('category.oils')}</span></Link></li>
                <li><Link to="/catalog/preserves"><img src="/img/all_goods.svg" alt="preserves" /> <span>{t('category.preserves')}</span></Link></li>
                <li><Link to="/catalog/snacks"><img src="/img/all_goods.svg" alt="snacks" /> <span>{t('category.snecks')}</span></Link></li>
                <li><Link to="/catalog/spices"><img src="/img/all_goods.svg" alt="spices" /> <span>{t('category.spices')}</span></Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;