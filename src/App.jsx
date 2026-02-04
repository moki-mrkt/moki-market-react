import React, { useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';

import Home from './components/Home/Home';
import Catalog from './components/Catalog/Catalog';
import PageProducts from './components/PageProducts/PageProducts';
import Product from './components/Product/Product';
import Checkout from './components/Checkout/Checkout';

import InfoPage from './components/InfoPage/InfoPage';

import AboutTab from './components/InfoPage/tabs/AboutTab';
import ContactsTab from './components/InfoPage/tabs/ContactsTab';
import PaymentTab from './components/InfoPage/tabs/PaymentTab';
import ReturnTab from './components/InfoPage/tabs/ReturnTab';
import ReviewsTab from './components/InfoPage/tabs/ReviewsTab';
import TermsTab from './components/InfoPage/tabs/TermsTab';

import AdminProducts from './components/admin/Admin/AdminProducts';
import AdminProductCreate from './components/admin/Admin/AdminProductCreate';
import LoginPage from './components/admin/Admin/LoginPage';
import PrivateRoute from './components/admin/Admin/PrivateRoute';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

function App() {
    const location = useLocation();

    return (
        <Routes>

            <Route path="/login" element={<LoginPage />} />

            {/* --- ГІЛКА МАГАЗИНУ (PUBLIC) --- */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="catalog/:categorySlug" element={<PageProducts />} />
                <Route path="search" element={<PageProducts key={location.search} />} />
                <Route path="product/:productId" element={<Product key={location.pathname} />} />
                <Route path="cart" element={<Checkout />} />
                <Route path="promotions" element={<PageProducts initialFilters={{ hasDiscount: true }} />} />

                <Route path="info" element={<InfoPage />}>
                    <Route index element={<Navigate to="about" replace />} />
                    <Route path="about" element={<AboutTab />} />
                    <Route path="reviews" element={<ReviewsTab />} />
                    <Route path="payment" element={<PaymentTab />} />
                    <Route path="return" element={<ReturnTab />} />
                    <Route path="contacts" element={<ContactsTab />} />
                    <Route path="terms" element={<TermsTab />} />
                </Route>
            </Route>

            {/* --- ГІЛКА АДМІНКИ (ADMIN) --- */}
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/create" element={<AdminProductCreate />} />
                <Route path="products/edit/:id" element={<AdminProductCreate />} />
            </Route>


            {/* 404 */}
            <Route path="*" element={
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Сторінку не знайдено</h2>
                    <a href="/">На головну</a>
                </div>
            } />
        </Routes>
    );
}
export default App;