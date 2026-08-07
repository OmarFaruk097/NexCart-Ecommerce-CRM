import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      userId: user ? user._id : 'guest', // Though guest is blocked by UI below, just in case
      items: cartItems,
      shippingDetails: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        zip: formData.zip
      },
      total: getCartTotal()
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error connecting to server.');
    }
  };

  if (cartItems.length === 0) return <div style={{textAlign: 'center', padding: '4rem'}}><h2>No items to checkout</h2></div>;
  if (!user) return <div style={{textAlign: 'center', padding: '4rem'}}><h2>Please log in to checkout.</h2><button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button></div>;

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2 className="form-title">Checkout</h2>
      <form onSubmit={handleCheckoutSubmit}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Shipping Details</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input type="text" id="name" className="form-input" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="address">Address</label>
          <input type="text" id="address" className="form-input" value={formData.address} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="city">City</label>
            <input type="text" id="city" className="form-input" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="zip">ZIP Code</label>
            <input type="text" id="zip" className="form-input" value={formData.zip} onChange={handleChange} required />
          </div>
        </div>

        <h3 style={{ margin: '1.5rem 0 1rem', color: 'var(--text-secondary)' }}>Payment Information</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="cardNumber">Card Number (Mock)</label>
          <input type="text" id="cardNumber" className="form-input" value={formData.cardNumber} onChange={handleChange} placeholder="XXXX-XXXX-XXXX-XXXX" required />
        </div>

        <div className="summary-total" style={{ margin: '2rem 0' }}>
          <span>Total to Pay:</span>
          <span>৳{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <button type="submit" className="btn btn-primary form-submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
