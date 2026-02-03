import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { getLabelFromSlug } from '../../constants/categories';
import './Breadcrumbs.css';

const CategoryBreadcrumb = ({ match }) => {
    return <span>{getLabelFromSlug(match.params.categorySlug)}</span>;
};

const Breadcrumbs = ({ customCrumbs }) => {
    const location = useLocation();

    const routes = [
        { path: '/', breadcrumb: 'Головна' },
        { path: '/catalog', breadcrumb: 'Каталог' },

        { path: '/catalog/:categorySlug', breadcrumb: CategoryBreadcrumb },
        { path: '/search', breadcrumb: 'Пошук'},
        { path: '/promotions', breadcrumb: 'Акції' },

        { path: '/product/:productId', breadcrumb: 'Товар' }
    ];


    const generatedCrumbs = useBreadcrumbs(routes);

    if (location.pathname === '/') return null;

    const breadcrumbsToRender = customCrumbs || generatedCrumbs;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumbs__list">
                {breadcrumbsToRender.map((item, index) => {
                    const isLast = index === breadcrumbsToRender.length - 1;

                    const path = item.match ? item.match.pathname : item.path;

                    const label = item.breadcrumb;

                    return (
                        <li key={path || index} className="breadcrumbs__item">
                            {isLast ? (
                                <span className="breadcrumbs__link">
                                    <span className="breadcrumbs__current">{label}</span>
                                </span>
                            ) : (
                                <Link to={path} className="breadcrumbs__link">
                                    {path === '/' && (
                                        <img
                                            className="home-img"
                                            src="/img/house.svg"
                                            alt="home"
                                            style={{ marginRight: '5px' }}
                                        />
                                    )}
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;