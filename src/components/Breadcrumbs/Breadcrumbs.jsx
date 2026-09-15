import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { getLabelFromSlug } from '../../constants/categories';
import './Breadcrumbs.css';
import {useTranslation} from "react-i18next";

const CategoryBreadcrumb = ({ match }) => {
    return <span>{getLabelFromSlug(match.params.categorySlug)}</span>;
};

const Breadcrumbs = ({ customCrumbs }) => {
    const location = useLocation();

    const { t } = useTranslation();

    const routes = [
        { path: '/', breadcrumb: t('header.main') },
        { path: '/catalog', breadcrumb: t('header.catalog') },
        { path: '/catalog/:categorySlug', breadcrumb: CategoryBreadcrumb },
        { path: '/search', breadcrumb: t('header.searchPlaceholder')},
        { path: '/promotions', breadcrumb: t('header.promotions') },
        { path: '/product/:productId', breadcrumb: 'Товар' }
    ];

    const generatedCrumbs = useBreadcrumbs(routes);

    if (location.pathname === '/') return null;

    const breadcrumbsToRender = customCrumbs || generatedCrumbs;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol
                className="breadcrumbs__list"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >

                {breadcrumbsToRender.map((item, index) => {
                    const isLast = index === breadcrumbsToRender.length - 1;
                    const path = item.match ? item.match.pathname : item.path;
                    const label = item.breadcrumb;

                    const absolutePath = window.location.origin + (path || "");

                    return (
                        <li
                            key={path || index}
                            className="breadcrumbs__item"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {isLast ? (
                                <span className="breadcrumbs__link">
                                    <span
                                        itemProp="name"
                                        className="breadcrumbs__current"
                                    >
                                        {label}
                                    </span>
                                    <meta itemProp="item" content={window.location.href} />
                                </span>
                            ) : (
                                <Link to={path}
                                      className="breadcrumbs__link"
                                      itemProp="item"
                                >
                                    {path === '/' && (
                                        <img
                                            className="home-img"
                                            src="/img/house.svg"
                                            alt="home"
                                            style={{ marginRight: '5px' }}
                                        />
                                    )}
                                    <span itemProp="name">{label}</span>
                                </Link>
                            )}
                            <meta itemProp="position" content={index + 1} />
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;