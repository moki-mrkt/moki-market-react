import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import CartDrawer from '../components/CartDrawer/CartDrawer.jsx';

const PublicLayout = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="app-wrapper">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <main className="main-content">
                {/* Outlet — це місце, куди підставлятимуться Home, Catalog і т.д. */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PublicLayout;