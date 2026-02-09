import React, { useState } from 'react';

import './Product.css';

const ProductTabs = ({ description, characteristics }) => {
    const [activeTab, setActiveTab] = useState('description');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="product-tabs-section">
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => handleTabClick('description')}
                >
                    Опис
                </button>
                <button
                    className={`tab-btn ${activeTab === 'characteristics' ? 'active' : ''}`}
                    onClick={() => handleTabClick('characteristics')}
                >
                    Характеристики
                </button>
                 {/*<button className="tab-btn" data-tab="reviews">Відгуки</button>*/}
            </div>

            <div className="tabs-content">

                {/* Вкладка Опис */}
                <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`} id="description">

                    <button
                        className={`mobile-accordion-btn ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => handleTabClick(activeTab === 'description' ? '' : 'description')}
                    >
                        <span className="accordion-btn-text">Опис</span>
                    </button>

                    <div className="tab-text">
                        <p>{description || 'Опис відсутній.'}</p>
                    </div>
                </div>

                <div className={`tab-pane ${activeTab === 'characteristics' ? 'active' : ''}`} id="characteristics">
                    <button
                        className={`mobile-accordion-btn ${activeTab === 'characteristics' ? 'active' : ''}`}
                        onClick={() => handleTabClick(activeTab === 'characteristics' ? '' : 'characteristics')}
                    >
                        <span className="accordion-btn-text">Характеристики</span>
                    </button>

                    <div className="tab-text">
                        {characteristics && Object.keys(characteristics).length > 0 ? (
                            <ul className="char-list">
                                {Object.entries(characteristics).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Характеристики відсутні.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductTabs;