import React, { useState, useEffect } from 'react';

const CustomerProfiles = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  useEffect(() => {
    fetch('https://nexcart-ecommerce-crm.onrender.com/api/crm/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleViewHistory = async (customer) => {
    setFetchingHistory(true);
    try {
      const res = await fetch(`https://nexcart-ecommerce-crm.onrender.com/api/orders/user/${customer._id}`);
      const data = await res.json();
      setUserOrders(data);
      setSelectedUser(customer);
    } catch (err) {
      console.error(err);
      alert('Error fetching user history');
    } finally {
      setFetchingHistory(false);
    }
  };

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Customer Profiles</h2>
      <div style={{ overflowX: 'auto', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--background-color)' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>ID</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Name</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Email</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Registered</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer._id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{customer._id}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{customer.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{customer.email}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{customer.registeredAt}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <button
                    className="btn"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: 'var(--background-color)' }}
                    onClick={() => handleViewHistory(customer)}
                    disabled={fetchingHistory}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--border-radius)', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Purchase History: {selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="btn" style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white' }}>Close</button>
            </div>

            {userOrders.length === 0 ? (
              <p>This user has not placed any orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userOrders.map(order => (
                  <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <strong>Order #{order.id}</strong>
                      <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{order.status}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.quantity}x {item.name || item.product_name} - ৳{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                      ))}
                    </ul>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total: ৳{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfiles;
