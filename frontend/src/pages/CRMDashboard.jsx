import React, { useState } from 'react';
import Analytics from '../components/crm/Analytics';
import CustomerProfiles from '../components/crm/CustomerProfiles';
import OrderManagement from '../components/crm/OrderManagement';
import InventoryControl from '../components/crm/InventoryControl';
import SupportSystem from '../components/crm/SupportSystem';

const CRMDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin123') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Incorrect password. Hint: admin123');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="form-container" style={{ marginTop: '10rem' }}>
        <h2 className="form-title">CRM Admin Access</h2>
        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input 
              type="password" 
              className="form-input"
              value={adminPass} 
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Enter password..."
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login to CRM</button>
        </form>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return <Analytics />;
      case 'customers': return <CustomerProfiles />;
      case 'orders': return <OrderManagement />;
      case 'inventory': return <InventoryControl />;
      case 'support': return <SupportSystem />;
      default: return <Analytics />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--surface-color)', borderRight: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <h3 style={{ padding: '0 2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Admin Menu</h3>
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {['analytics', 'customers', 'orders', 'inventory', 'support'].map((tab) => (
            <li key={tab}>
              <button 
                onClick={() => setActiveTab(tab)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem 2rem',
                  background: activeTab === tab ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-primary)',
                  border: 'none',
                  borderRight: activeTab === tab ? '4px solid var(--primary-color)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? '600' : '400',
                  fontSize: '1rem',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem 3rem', background: 'var(--background-color)' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CRMDashboard;
