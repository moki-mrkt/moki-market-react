import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {Helmet} from "react-helmet-async";

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductCard from '../../components/ProductCard/ProductCard';

import { productService } from '../../services/productService';
import { getEnumFromSlug, getLabelFromSlug } from '../../constants/categories';
import { SEO_TEXTS } from '../../constants/seoText';
import './PageProducts.css';

const PageGoods = ({ initialFilters = {} }) => {

    const { categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query');

    const isLoadMore = useRef(false);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [sortOrder, setSortOrder] = useState('creationTime,desc');

    const [availableSubcategories, setAvailableSubcategories] = useState([]);

    const [sliderLimits, setSliderLimits] = useState({ min: 0, max: 9999 });

    const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

    const [appliedFilters, setAppliedFilters] = useState({
        minPrice: null,
        maxPrice: null,
        subcategories: [],
        hasDiscount: initialFilters.hasDiscount || false
    });

    useEffect(() => {

        const fetchProducts = async () => {

            const backendCategory = getEnumFromSlug(categorySlug);

            if (!backendCategory && !searchQuery && !appliedFilters.hasDiscount) {
                console.error(`Unknown category slug: ${categorySlug}`);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {

                const params = {
                    category: backendCategory,
                    query: searchQuery,
                    page: currentPage,
                    size: 20,
                    sort: sortOrder,
                    minPrice: appliedFilters.minPrice,
                    maxPrice: appliedFilters.maxPrice,
                    subcategory: appliedFilters.subcategories.length > 0 ? appliedFilters.subcategories : null,
                    hasDiscount: appliedFilters.hasDiscount
                };

                const response = await productService.search(params);

                const pageData = response.products || response;

                if (pageData && pageData.content) {
                    setTotalPages(pageData.page.totalPages || 0);

                    setProducts(prev => {
                        if (currentPage === 0 || !isLoadMore.current) return pageData.content;

                        const newItems = pageData.content.filter(newItem =>
                            !prev.some(existing => existing.id === newItem.id)
                        );
                        return [...prev, ...newItems];
                    });
                } else {
                    if (currentPage === 0) setProducts([]);
                }

                if (currentPage === 0) {

                    if (response.subcategories && response.subcategories.length > 0) {
                        setAvailableSubcategories(response.subcategories);
                    }

                    if (response.minPrice !== undefined && response.maxPrice !== undefined) {
                        const backendMin = Math.floor(response.minPrice);
                        const backendMax = Math.ceil(response.maxPrice);

                        setSliderLimits({ min: backendMin, max: backendMax });

                        if (appliedFilters.minPrice === null && appliedFilters.maxPrice === null) {
                            setPriceRange({ min: backendMin, max: backendMax });
                        }
                    }
                }

            } catch (error) {
                console.error("Failed to fetch category products", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug || searchQuery || appliedFilters.hasDiscount === true) {
            fetchProducts();
        }

    }, [searchQuery, categorySlug, currentPage, sortOrder, appliedFilters]);

    useEffect(() => {
        setCurrentPage(0);
        setProducts([]);
        setAppliedFilters({
            minPrice: null,
            maxPrice: null,
            subcategories: [],
            hasDiscount: initialFilters.hasDiscount || false
        });
        setPriceRange({ min: 0, max: 9999 });
        setSliderLimits({ min: 0, max: 9999 });
        setAvailableSubcategories([]);
        isLoadMore.current = false;
        window.scrollTo(0, 0);
    }, [categorySlug, initialFilters.hasDiscount]);

    const handleRangeChange = (e) => {
        const { id, value } = e.target;
        setPriceRange(prev => ({
            ...prev,
            [id === 'range-min' ? 'min' : 'max']: Number(value)
        }));
    };

    const handleSubcategoryChange = (sub) => {
        setSelectedSubcategories(prev => {
            if (prev.includes(sub)) {
                return prev.filter(item => item !== sub);
            } else {
                return [...prev, sub];
            }
        });
    }

    const handleResetFilters = () => {

        setSelectedSubcategories([]);
        setPriceRange({
            min: sliderLimits.min,
            max: sliderLimits.max
        });

        setAppliedFilters({
            subcategories: [],
            minPrice: sliderLimits.min,
            maxPrice: sliderLimits.max,
            hasDiscount: initialFilters.hasDiscount || false
        });

        setSortOrder('creationTime,desc');

        setCurrentPage(0);
    };

    const applyFilters = () => {
        setCurrentPage(0);

        setAppliedFilters(prev => ({
            ...prev,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            subcategories: selectedSubcategories
        }));

        setIsFilterOpen(false);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(0);
    };

    const handleInputBlur = () => {

        let newMin = priceRange.min === '' ? sliderLimits.min : priceRange.min;
        let newMax = priceRange.max === '' ? sliderLimits.max : priceRange.max;

        newMin = Math.max(sliderLimits.min, newMin);
        newMax = Math.min(sliderLimits.max, newMax);

        if (newMin > newMax) {
            newMin = newMax;
        }

        setPriceRange({ min: newMin, max: newMax });
    };

    const getPercent = (value) => {
        const { min, max } = sliderLimits;
        if (max === min) return 0;

        const safeValue = value === '' ? min : Number(value);

        const percent = Math.round(((safeValue - min) / (max - min)) * 100);
        return Math.max(0, Math.min(100, percent));
    };

    const seoContent = categorySlug ? (SEO_TEXTS[categorySlug] || SEO_TEXTS['default']) : SEO_TEXTS['default'];

    const siteUrl = "https://moki.com.ua";
    const currentUrl = categorySlug
        ? `${siteUrl}/catalog/${categorySlug}`
        : siteUrl;

    const shouldNoIndex = searchQuery || appliedFilters.minPrice || appliedFilters.subcategories.length > 0;

    return (
        <main className="hero-section">

            <Helmet>
                <title>{searchQuery ? `Пошук: ${searchQuery}` : `${seoContent.title} купити в Україні | Moki Market`}</title>
                <meta name="description" content={seoContent.intro?.[0]?.substring(0, 160) || `${seoContent.title} в Moki Market...`} />

                {!searchQuery && <link rel="canonical" href={currentUrl} />}

                {shouldNoIndex && <meta name="robots" content="noindex, follow" />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={seoContent.title} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={`${siteUrl}/img/categories/${categorySlug || 'default'}.webp`} />

                {!searchQuery && products.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": seoContent.title,
                            "numberOfItems": products.length,
                            "itemListElement": products.map((product, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "url": `${siteUrl}/products/${product.slug}`
                            }))
                        })}
                    </script>
                )}
            </Helmet>

            <div className="container hero__grid">

                <Breadcrumbs />

                {searchQuery ? (
                    <h1 className="catalog-title">Результати пошуку: "{searchQuery}"</h1>
                ) : (
                    <h1 className="catalog-title">{getLabelFromSlug(categorySlug)}</h1>
                )}

                <div className="catalog-header">
                    <div className="sorting-wrapper desktop-sort">
                        <span>Сортування </span>
                        <label>
                            <select
                                className="sort-select"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="creationTime,desc">за останнім</option>
                                <option value="priceWithDiscount,asc">від дешевих</option>
                                <option value="priceWithDiscount,desc">від дорогих</option>
                            </select>
                        </label>
                    </div>

                    <div className="mobile-catalog-bar">
                        <button className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
                            <div></div><div></div><div></div>
                        </button>
                        <div className="mobile-sort-container">
                            <div className="sort-icon-wrapper">
                                <img src="/img/sorting.svg" alt="Sort" />
                            </div>
                            <select
                                className="mobile-sort-select"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="creationTime,desc">За замовчуванням</option>
                                <option value="priceWithDiscount,asc">Від дешевих</option>
                                <option value="priceWithDiscount,desc">Від дорогих</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="goods-section">

                    <div
                        className={`filter-mobile-menu-overlay ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => setIsFilterOpen(false)}
                    ></div>

                    <aside className={`filter ${isFilterOpen ? 'active' : ''}`} id="mobile-filter-sidebar">

                        <div className="filter-group">
                            <div className="mobile-filter-header">
                                <h4>Ціна</h4>
                                <button
                                    className="close-filter-btn"
                                    onClick={() => setIsFilterOpen(false)}
                                >&times;</button>
                            </div>

                            <div className="price-inputs">
                                <input
                                    type="number"

                                    min="0"
                                    value={priceRange.min}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setPriceRange({ ...priceRange, min: '' });
                                            return;
                                        }

                                        const num = Number(val);
                                        if (num >= 0) {
                                            setPriceRange({ ...priceRange, min: num });
                                        }
                                    }}
                                    onBlur={handleInputBlur}
                                    className="price-field"
                                />
                                <span className="separator">—</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={priceRange.max}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setPriceRange({ ...priceRange, max: '' });
                                            return;
                                        }
                                        const num = Number(val);
                                        if (num >= 0) {
                                            setPriceRange({ ...priceRange, max: num });
                                        }
                                    }}
                                    onBlur={handleInputBlur}
                                    className="price-field"
                                />
                                <button className="btn-ok" onClick={applyFilters}>OK</button>
                            </div>

                            <div className="range-slider-container">
                                <div className="slider-track"></div>
                                <div
                                    className="slider-range"
                                    style={{
                                        left: `${getPercent(priceRange.min)}%`,
                                        right: `${100 - getPercent(priceRange.max)}%`
                                    }}
                                ></div>
                                <input
                                    type="range"
                                    min={sliderLimits.min} max={sliderLimits.max}
                                    value={priceRange.min}
                                    id="range-min"
                                    className="range-input"
                                    onChange={handleRangeChange}
                                />
                                <input
                                    type="range"
                                    min={sliderLimits.min} max={sliderLimits.max}
                                    value={priceRange.max}
                                    id="range-max"
                                    className="range-input"
                                    onChange={handleRangeChange}
                                />
                            </div>
                        </div>

                        {availableSubcategories.length > 0 && (
                            <div className="filter-group">
                                <div className="filter-header">
                                    <h4>Категорія</h4>
                                    <button
                                        className="reset-filter"
                                        onClick={handleResetFilters}
                                    >&times;</button>
                                </div>
                                <ul className="filter-list">
                                    {availableSubcategories.map((item) => (
                                        <li key={item}>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubcategories.includes(item)}
                                                    onChange={() => handleSubcategoryChange(item)}
                                                />
                                                <span className="checkmark"></span>
                                                <span>{item}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button className="btn-apply" onClick={applyFilters}>Застосувати</button>
                    </aside>

                    <div className="goods-grid">

                        {loading && currentPage === 0 ? (
                            <div style={{textAlign: 'center', width: '100%', padding: '50px'}}>Завантаження...</div>
                        ) : products.length > 0 ? (
                            <div className="goods-list">
                                {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{textAlign: 'center', width: '100%', padding: '50px'}}>Товарів не знайдено.</div>
                        )}

                        {totalPages > 1 && (
                            <div className="pagination-section">

                                {totalPages > 1 && currentPage < totalPages - 1 && (
                                    <div className="pagination-section">
                                        <button
                                            className="btn-load-more pag-but"
                                            onClick={() => {
                                                       isLoadMore.current = true;
                                                       setCurrentPage(prev => prev + 1);
                                                   }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Завантаження...' : 'Більше товарів'}
                                        </button>
                                    </div>
                                )}

                                <div className="pagination-controls">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            className={`page-link pag-but ${index === currentPage ? 'active' : ''}`}
                                            onClick={() => {
                                                isLoadMore.current = false;
                                                setCurrentPage(index);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    {currentPage < totalPages - 1 && (
                                        <button
                                            className="page-link pag-but next-btn"
                                            onClick={() => {
                                                isLoadMore.current = false;
                                                setCurrentPage(prev => prev + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            Вперед
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <section className="category-description">
                    <h2 className="seo-title">{seoContent.title}</h2>

                    <div className="seo-content">
                        {seoContent.intro?.map((paragraph, index) => (
                            <p key={`intro-${index}`}>{paragraph}</p>
                        ))}

                        {seoContent.features?.length > 0 && (
                            <>
                                <h3>{seoContent.featuresTitle || "Особливості"}</h3>
                                <ul>
                                    {seoContent.features.map((item, index) => (
                                        <li key={`feature-${index}`}>
                                            <strong>{item.label}</strong> — {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {seoContent.tips?.length > 0 && (
                            <>
                                <h3>{seoContent.tipsTitle || "Корисні поради"}</h3>
                                <ol>
                                    {seoContent.tips.map((tip, index) => (
                                        <li key={`tip-${index}`}>{tip}</li>
                                    ))}
                                </ol>
                            </>
                        )}

                        {seoContent.whyUs?.length > 0 && (
                            <>
                                <h3>{seoContent.whyUsTitle || `Чому варто купити ${seoContent.title.toLowerCase()} саме у нас:`}</h3>
                                <ul>
                                    {seoContent.whyUs.map((reason, index) => (
                                        <li key={`reason-${index}`}>{reason}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {seoContent.footer ? (
                            <p className="seo-footer-text">{seoContent.footer}</p>
                        ) : (
                            <p className="seo-footer-text">
                                Обирайте найкращі {seoContent.title.toLowerCase()} для всієї родини у нашому магазині!
                            </p>
                        )}
                    </div>
                </section>

            </div>
        </main>
    );
};

export default PageGoods;