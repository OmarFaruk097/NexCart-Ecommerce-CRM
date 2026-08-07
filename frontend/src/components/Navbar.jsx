import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="navbar">
      <div className="nav-brand">NexCart</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Storefront
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Support
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/crm" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            CRM Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Cart
          </NavLink>
        </li>
        {user ? (
          <>
            <li style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', color: 'var(--text-secondary)' }}>
              Hello, {user.name}
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-primary" style={{ color: 'white', marginLeft: '1rem', background: '#ef4444', border: 'none' }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className="btn btn-primary" style={{ color: 'white', marginLeft: '1rem' }}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
