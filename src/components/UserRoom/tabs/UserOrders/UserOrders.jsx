import React, {useEffect, useState} from 'react';
import { orderService } from '../../../../services/orderService';

import toast from 'react-hot-toast';
import CancelOrderModal from '../../../Modals/CancelOrderModal/CancelOrderModal';

import './UserOrders.css';

const paymentMap = {
    'CASH': 'Оплата при отриманні',
    'CARD': 'Оплата картою'
};

const deliveryMap = {
    'NOVA_POSHTA': 'Нова Пошта',
    'UKR_POSHTA': 'Укрпошта'
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const UserOrders = () => {

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {

                const data = await orderService.getOrdersByUser(page, 10);
                setOrders(data.content || []);
                setTotalPages(data.page?.totalPages || 0);
            } catch (error) {
                console.error("Помилка завантаження замовлень:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, refreshTrigger]);


    const confirmCancelOrder = async () => {
        setIsCanceling(true);
        try {
            await orderService.cancelOrder(selectedOrder.id);

            setIsCancelModalOpen(false);
            setSelectedOrder(null);

            setRefreshTrigger(prev => prev + 1);

            toast.success("Замовлення успішно скасовано");
        } catch (error) {
            console.error("Помилка скасування:", error);
            toast.error("Не вдалося скасувати замовлення. Спробуйте пізніше.");
        } finally {
            setIsCanceling(false);
        }
    };

    const handleOpenCancelModal = () => {
        console.log("Open")
        setIsCancelModalOpen(true);
    };

    const statusMapStyle = {
        'NEW': { label: 'Нове', bg: '#DBEAFE', text: '#1E40AF' },
        'CONFIRMED': { label: 'В обробці', bg: '#FEF3C7', text: '#92400E' },
        'SHIPPED': { label: 'Відправлено', bg: 'rgb(255,231,184)', text: '#D97706' },
        'DONE': { label: 'Виконано', bg: '#D1FAE5', text: '#065F46' },
        'CANCELED': { label: 'Скасовано', bg: '#FEE2E2', text: '#991B1B' }
    };



    if (selectedOrder) {
        console.log(selectedOrder)

        const addr = selectedOrder.addressDTO || {};

        const currentStatusConfig = statusMapStyle[selectedOrder.orderStatus] || {
            label: selectedOrder.orderStatus,
            bg: '#F3F4F6',
            text: '#374151'
        };

        return (
            <div id="order-details-view">

                <CancelOrderModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={confirmCancelOrder}
                    orderNumber={selectedOrder?.orderNumber}
                    isCanceling={isCanceling}
                />

                <div className="details-main-card">
                    <div className="details-header">
                        <div className="back-link-and-status">
                            <button className="back-link" onClick={() => setSelectedOrder(null)}>
                                <img src="/img/left-arrow.svg" alt="Back" style={{ height: '16px' }} />
                                Назад до списку
                            </button>
                            <div className="status-block"
                                 style={{
                                     backgroundColor: currentStatusConfig.bg,
                                     color: currentStatusConfig.text
                                 }}
                            >
                                {currentStatusConfig.label}
                            </div>
                        </div>
                        <h2 className="content-title">Подробиці замовлення №{selectedOrder.orderNumber}</h2>
                        <p  className="date-text">
                            від {formatDate(selectedOrder.createAt)}
                        </p>
                    </div>

                    <div className="details-list">
                        <div className="details-row header-row">
                            <span>Товар</span>
                            <span>Загалом</span>
                        </div>

                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                            <>
                                <div className="details-row" key={index}>
                                    <div>
                                        <span>{item.itemName} × {item.quantity} шт.</span><br/>
                                        <span>1 шт. - {item.finalPricePerUnit} грн</span>
                                        {item.finalPricePerUnit !== item.basePriceAtPurchase && (
                                            <span className="order-item-price-without-discount">{item.basePriceAtPurchase} грн</span>
                                        )}
                                    </div>
                                    <span className="price-text">{item.totalAmount} грн</span>
                                </div>
                                <hr className="details-divider" />
                            </>
                        ))}

                        <div className="details-summary">
                            <div className="summary-row">
                                <span>Спосіб оплати:</span>
                                <span className="highlight">{paymentMap[selectedOrder.paymentType] || selectedOrder.paymentType}</span>
                            </div>
                            {selectedOrder.discountTotal > 0 && (
                                <div className="summary-row">
                                    <span>Знижка:</span>
                                    <span className="highlight" style={{color: 'red'}}>-{selectedOrder.discountTotal} грн</span>
                                </div>
                            )}
                            <div className="summary-row summary-total">
                                <span className="total">Всього:</span>
                                <span className="highlight">{selectedOrder.total} грн</span>
                            </div>
                            <p className="warning-text">
                                *Скасувати замовлення можно тільки якщо воно має статус "Нове". В інших випадках будь-ласка зверніться до менеджера!
                            </p>
                        </div>


                        {selectedOrder.orderStatus === 'NEW' && (
                            <div className="cancel-order-block">
                                <button
                                    onClick={handleOpenCancelModal}
                                    className="cancel-order-button"
                                >
                                    Скасувати замовлення
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="address-card">
                    <h3 className="content-title" style={{fontSize: '24px', marginBottom: '20px'}}>Дані доставки</h3>
                    <div className="address-info">
                        <p className="user-name-small">{selectedOrder.firstName} {selectedOrder.secondName}</p>
                        <p style={{color: '#0E2CA4', marginBottom: '10px' }}>
                            {selectedOrder.phoneNumber}
                            <br/>
                            {selectedOrder.email}
                        </p>

                        <p><strong>{deliveryMap[selectedOrder.deliveryType] || selectedOrder.deliveryType}</strong></p>

                        <p>
                            {addr.region && `${addr.region}, `}
                            {addr.city && `${addr.city}, `}
                            {addr.street && `${addr.street} `}
                            {addr.houseNumber && `буд. ${addr.houseNumber} `}
                            {addr.apartment && `кв. ${addr.apartment}`}
                        </p>
                        <p>
                            {addr.department && `Відділення/Поштомат: ${addr.department}`}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="orders-list-view">

            <h2 className="content-title" style={{ marginBottom: '30px' }}>Мої замовлення</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#0E2CA4' }}>
                    <h3>У вас ще немає замовлень</h3>
                </div>
            ) : (
                <>
                    <div className="orders-table-wrapper" style={{
                        opacity: loading ? 0.5 : 1,
                        pointerEvents: loading ? 'none' : 'auto',
                        transition: 'opacity 0.2s ease-in-out'
                    }}>
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>Замовлення</th>
                                <th>Дата</th>
                                <th className="status-processing">Статус</th>
                                <th className="sum-column">Сума</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>№ {order.orderNumber}</td>
                                    <td className="td-date-text">{formatDate(order.createAt)}</td>
                                    <td className="status-processing">
                                        <span style={{
                                            backgroundColor: statusMapStyle[order.orderStatus]?.bg || '#F3F4F6',
                                            color: statusMapStyle[order.orderStatus]?.text || '#374151',
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            fontWeight: '500',
                                            display: 'inline-block'
                                        }}>
                                            {statusMapStyle[order.orderStatus]?.label || order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="sum-column">{order.total} грн</td>
                                    <td>
                                        <button
                                            className="view-link"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            Перегляд
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>


                    {totalPages > 1 && (
                        <div className="pag-block">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                style={{
                                    padding: '5px 15px', cursor: 'pointer',
                                    border: '2px solid #F0D051', borderRadius: '10px', background: 'transparent', color: '#0E2CA4', fontWeight: '600',
                                    visibility: page > 0 ? 'visible' : 'hidden'
                                }}
                            >
                                Попередня
                            </button>

                            <span style={{ padding: '5px', color: '#0E2CA4', minWidth: '130px', textAlign: 'center' }}>
                                Сторінка {page + 1} з {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => p + 1)}
                                style={{
                                    padding: '5px 15px', cursor: 'pointer',
                                    border: '2px solid #F0D051', borderRadius: '10px', background: 'transparent', color: '#0E2CA4', fontWeight: '600',
                                    visibility: page < totalPages - 1 ? 'visible' : 'hidden'
                                }}
                            >
                                Наступна
                            </button>

                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserOrders;