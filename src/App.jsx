import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

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

import AdminProducts from './components/admin/Product/AdminProducts.jsx';
import AdminProductCreate from './components/admin/Product/AdminProductCreate.jsx';
import LoginPage from './components/admin/Admin/LoginPage';
import PrivateRoute from './components/admin/Admin/PrivateRoute';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminProductInfo from "./components/admin/Product/AdminProductInfo.jsx";

import { CartProvider } from './components/CartContext/CartContext';

import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import AdminOrders from "./components/admin/Order/AdminOrders.jsx";
import AdminOrderInfo from "./components/admin/Order/AdminOrderInfo.jsx";
import AdminOrderEdit from "./components/admin/Order/AdminOrderEdit.jsx";
import AdminFeedbacks from "./components/admin/Feedback/AdminFeedbacks.jsx";

import UserRoom from './components/UserRoom/UserRoom';
import UserInfo from './components/UserRoom/tabs/UserInfo';
import UserOrders from './components/UserRoom/tabs/UserOrders';
import UserWishlist from './components/UserRoom/tabs/UserWishlist';
import UserReviews from './components/UserRoom/tabs/UserReviews';
import ActivateAccount from "./utils/ActivateAccount.jsx";
import {Toaster} from "react-hot-toast";
import React from "react";

function App() {
    const location = useLocation();

    return (
        <CartProvider>
            <Toaster position="top-right"
                     toastOptions={{
                         className: 'moki-toast',
                     }}
                     reverseOrder={false} />
        <Routes>

            <Route path="/activate" element={<ActivateAccount />} />
            <Route path="admin-ui/login" element={<LoginPage />} />

            {/* --- ГІЛКА МАГАЗИНУ (PUBLIC) --- */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home key={location.pathname} />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="catalog/:categorySlug" element={<PageProducts />} />
                <Route path="search" element={<PageProducts key={location.search} />} />
                <Route path="product/:productId" element={<Product key={location.pathname} />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="promotions" element={<PageProducts initialFilters={{ hasDiscount: true }} />} />

                <Route path="*" element={<NotFoundPage />} />

                <Route path="profile" element={<UserRoom />}>
                    {/* Редірект за замовчуванням на 'info' */}
                    <Route index element={<Navigate to="info" replace />} />

                    <Route path="info" element={
                        <PrivateRoute>
                            <UserInfo />
                        </PrivateRoute>
                    }
                    />
                    <Route path="orders" element={<UserOrders />} />
                    <Route path="wishlist" element={<UserWishlist />} />
                    <Route path="reviews" element={<UserReviews />} />
                </Route>

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
                path="/admin-ui/*"
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
                <Route path="products/view/:id" element={<AdminProductInfo />} />

                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/view/:id" element={<AdminOrderInfo  key={location.pathname}/>} />
                <Route path="orders/edit/:id" element={<AdminOrderEdit />} />

                <Route path="feedbacks" element={<AdminFeedbacks />} />
            </Route>

        </Routes>
        </CartProvider>
    );
}
export default App;