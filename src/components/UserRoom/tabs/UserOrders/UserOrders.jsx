import React, {useEffect, useState} from 'react';
import { orderService } from '../../../../services/orderService';
import toast from 'react-hot-toast';
import CancelOrderModal from '../../../Modals/CancelOrderModal/CancelOrderModal';
import { useTranslation } from 'react-i18next'; // Імпорт
import './UserOrders.css';

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
    const { t } = useTranslation();

    const paymentMap = {
        'CASH': t('user-orders.payment.cash'),
        'CARD': t('user-orders.payment.card')
    };

    const deliveryMap = {
        'NOVA_POSHTA': t('user-orders.delivery.np'),
        'UKR_POSHTA': t('user-orders.delivery.up')
    };

    const statusMapStyle = {
        'NEW': { label: t('user-orders.status.new'), bg: '#DBEAFE', text: '#1E40AF' },
        'CONFIRMED': { label: t('user-orders.status.confirmed'), bg: '#FEF3C7', text: '#92400E' },
        'SHIPPED': { label: t('user-orders.status.shipped'), bg: 'rgb(255,231,184)', text: '#D97706' },
        'DONE': { label: t('user-orders.status.done'), bg: '#D1FAE5', text: '#065F46' },
        'CANCELED': { label: t('user-orders.status.canceled'), bg: '#FEE2E2', text: '#991B1B' }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await orderService.getOrdersByUser(page, 10);
                setOrders(data.content || []);
                setTotalPages(data.page?.totalPages || 0);
            } catch (error) {
                console.error("Помилка завантаження замовлень:", error);
                toast.error(t('user-orders.load-error'));
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [page, refreshTrigger, t]);


    const confirmCancelOrder = async () => {
        setIsCanceling(true);
        try {
            await orderService.cancelOrder(selectedOrder.id);
            setIsCancelModalOpen(false);
            setSelectedOrder(null);
            setRefreshTrigger(prev => prev + 1);
            toast.success(t('user-orders.cancel-success'));
        } catch (error) {
            toast.error(t('user-orders.cancel-error'));
        } finally {
            setIsCanceling(false);
        }
    };

    if (selectedOrder) {
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
                                {t('user-orders.back')}
                            </button>
                            <div className="status-block"
                                 style={{ backgroundColor: currentStatusConfig.bg, color: currentStatusConfig.text }}
                            >
                                {currentStatusConfig.label}
                            </div>
                        </div>
                        <h2 className="content-title">{t('user-orders.details-title')}{selectedOrder.orderNumber}</h2>
                        <p  className="date-text">
                            {t('user-orders.from')} {formatDate(selectedOrder.createAt)}
                        </p>
                    </div>

                    <div className="details-list">
                        <div className="details-row header-row">
                            <span>{t('user-orders.product')}</span>
                            <span>{t('user-orders.total')}</span>
                        </div>

                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="details-row">
                                    <div>
                                        <span>{item.itemName} × {item.quantity} {t('user-orders.pcs')}</span><br/>
                                        <span>1 {t('user-orders.pcs')} - {item.finalPricePerUnit} {t('user-orders.currency')}</span>
                                        {item.finalPricePerUnit !== item.basePriceAtPurchase && (
                                            <span className="order-item-price-without-discount">{item.basePriceAtPurchase} {t('user-orders.currency')}</span>
                                        )}
                                    </div>
                                    <span className="price-text">{item.totalAmount} {t('user-orders.currency')}</span>
                                </div>
                                <hr className="details-divider" />
                            </React.Fragment>
                        ))}

                        <div className="details-summary">
                            <div className="summary-row">
                                <span>{t('user-orders.pay-method')}</span>
                                <span className="highlight">{paymentMap[selectedOrder.paymentType] || selectedOrder.paymentType}</span>
                            </div>
                            {selectedOrder.discountTotal > 0 && (
                                <div className="summary-row">
                                    <span>{t('user-orders.discount')}</span>
                                    <span className="highlight" style={{color: 'red'}}>-{selectedOrder.discountTotal} {t('user-orders.currency')}</span>
                                </div>
                            )}
                            <div className="summary-row summary-total">
                                <span className="total">{t('user-orders.total-sum')}</span>
                                <span className="highlight">{selectedOrder.total} {t('user-orders.currency')}</span>
                            </div>
                            <p className="warning-text">{t('user-orders.cancel-warning')}</p>
                        </div>


                        {selectedOrder.orderStatus === 'NEW' && (
                            <div className="cancel-order-block">
                                <button onClick={() => setIsCancelModalOpen(true)} className="cancel-order-button">
                                    {t('user-orders.cancel-btn')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="address-card">
                    <h3 className="content-title" style={{fontSize: '24px', marginBottom: '20px'}}>{t('user-orders.delivery-data')}</h3>
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
                            {addr.houseNumber && `${t('user-orders.house')} ${addr.houseNumber} `}
                            {addr.apartment && `${t('user-orders.apt')} ${addr.apartment}`}
                        </p>
                        <p>
                            {addr.department && `${t('user-orders.branch')} ${addr.department}`}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="orders-list-view">

            <h2 className="content-title" style={{ marginBottom: '30px' }}>{t('user-orders.title')}</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#0E2CA4' }}>
                    <h3>{t('user-orders.empty')}</h3>
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
                                <th>{t('user-orders.table.order')}</th>
                                <th>{t('user-orders.table.date')}</th>
                                <th className="status-processing">{t('user-orders.table.status')}</th>
                                <th className="sum-column">{t('user-orders.table.sum')}</th>
                                <th>{t('user-orders.table.actions')}</th>
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
                                    <td className="sum-column">{order.total} {t('user-orders.currency')}</td>
                                    <td>
                                        <button className="view-link" onClick={() => setSelectedOrder(order)}>
                                            {t('user-orders.table.view')}
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
                                {t('tabs.previous')}
                            </button>

                            <span style={{ padding: '5px', color: '#0E2CA4', minWidth: '130px', textAlign: 'center' }}>
                                {t('tabs.page')} {page + 1} {t('tabs.from')} {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => p + 1)}
                                style={{
                                    padding: '5px 15px', cursor: 'pointer',
                                    border: '2px solid #F0D051', borderRadius: '10px', background: 'transparent', color: '#0E2CA4', fontWeight: '600',
                                    visibility: page < totalPages - 1 ? 'visible' : 'hidden'
                                }}
                            >
                                {t('tabs.next')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserOrders;