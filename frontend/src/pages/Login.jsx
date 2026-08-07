import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLoginSubmit = async (credentials) => {
    try {
      const response = await fetch('http://https://nexcart-ecommerce-crm.onrender.com:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/');
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Error connecting to server.');
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLoginSubmit} title="Welcome Back" />
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
