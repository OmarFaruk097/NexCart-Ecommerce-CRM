import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/products').then(res => res.json()),
      fetch('http://localhost:5000/api/crm/orders').then(res => res.json()),
      fetch('http://localhost:5000/api/crm/customers').then(res => res.json())
    ]).then(([productsData, ordersData, customersData]) => {
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  const lowStockProducts = products.filter(p => p.stock < 5);
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrdersCount = orders.filter(order => order.status === 'Processing').length;
  const activeUsersCount = customers.length;
  
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>Total Sales</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>৳{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div style={{ background: 'var(--secondary-color)', color: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>Active Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeUsersCount}</p>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>Pending Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{pendingOrdersCount}</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Sales Overview (Mock Chart)</h3>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '40px', background: 'var(--primary-color)', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '40px', background: 'var(--primary-color)', height: '80%', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '40px', background: 'var(--primary-color)', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '40px', background: 'var(--primary-color)', height: '90%', borderRadius: '4px 4px 0 0' }}></div>
          <div style={{ width: '40px', background: 'var(--primary-color)', height: '70%', borderRadius: '4px 4px 0 0' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <span style={{ width: '40px', textAlign: 'center' }}>Mon</span>
          <span style={{ width: '40px', textAlign: 'center' }}>Tue</span>
          <span style={{ width: '40px', textAlign: 'center' }}>Wed</span>
          <span style={{ width: '40px', textAlign: 'center' }}>Thu</span>
          <span style={{ width: '40px', textAlign: 'center' }}>Fri</span>
        </div>
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Low Inventory Alerts</h3>
        {lowStockProducts.length === 0 ? (
          <p>All products have sufficient stock (5+ items).</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {lowStockProducts.map(p => (
              <li key={p.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.name} ({p.category})</span>
                <span style={{ fontWeight: 'bold', color: p.stock === 0 ? '#ef4444' : '#f59e0b' }}>
                  {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Analytics;
