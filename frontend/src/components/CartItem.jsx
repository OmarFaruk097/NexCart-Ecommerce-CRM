import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img 
        src={item.imageUrl || item.imageurl} 
        alt={item.name} 
        className="cart-item-image" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
        }}
      />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p className="cart-item-price">৳{Number(item.price).toLocaleString()}</p>
      </div>
      <div className="cart-item-controls">
        <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span className="cart-item-qty">{item.quantity}</span>
        <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <div className="cart-item-total">
        ৳{(item.price * item.quantity).toLocaleString()}
      </div>
      <button className="btn-remove" onClick={() => removeFromCart(item.id)}>✕</button>
    </div>
  );
};

export default CartItem;
