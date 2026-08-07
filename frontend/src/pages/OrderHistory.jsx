import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const userId = user._id;
        const response = await fetch(`http://https://nexcart-ecommerce-crm.onrender.com:5000/api/orders/user/${userId}`);
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Please log in to view your orders.</h2><button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button></div>;
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Loading orders...</h2></div>;

  return (
    <div>
      <h1 className="page-title">Your Order History</h1>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p style={{ textAlign: 'center' }}>You have no past orders.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-label">Order ID:</span> {order.id}
                </div>
                <div>
                  <span className="order-label">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="order-label">Status:</span> <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{order.status}</span>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              {order.status !== 'Cancelled' ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 1rem 1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '4px', background: 'var(--border-color)', zIndex: 1, transform: 'translateY(-50%)' }}></div>
                  <div style={{ position: 'absolute', top: '50%', left: '0', width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '50%' : '0%', height: '4px', background: '#10b981', zIndex: 2, transform: 'translateY(-50%)', transition: 'width 0.3s ease' }}></div>

                  {['Processing', 'Shipped', 'Delivered'].map((step, index) => {
                    let isCompleted = false;
                    let isActive = false;
                    if (order.status === 'Delivered') { isCompleted = true; isActive = step === 'Delivered'; }
                    else if (order.status === 'Shipped') { isCompleted = index <= 1; isActive = step === 'Shipped'; }
                    else if (order.status === 'Processing') { isCompleted = index === 0; isActive = step === 'Processing'; }

                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, background: 'var(--surface-color)', padding: '0 0.5rem' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: isCompleted ? '#10b981' : 'var(--border-color)',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold',
                          boxShadow: isActive ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                        }}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 'bold' : 'normal' }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#ef4444', fontWeight: 'bold', background: '#fee2e2', borderRadius: '4px', margin: '1rem 0' }}>
                  This order was cancelled.
                </div>
              )}

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{item.quantity}x {item.name}</span>
                    <span>৳{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total:</span>
                <span>৳{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
