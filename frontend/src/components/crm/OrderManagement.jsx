import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        alert(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Order Management</h2>
      <div className="orders-container" style={{ maxWidth: '100%' }}>
        {orders.length === 0 ? <p>No orders found.</p> : null}
        {orders.map(order => (
          <div key={order.id} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Order #{order.id}</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                User ID: {order.userId} | Total: ৳{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'white' }}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
