import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.imageUrl || product.imageurl} 
          alt={product.name} 
          className="product-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </div>
        <div className="product-footer">
          <span className="product-price">৳{Number(product.price).toLocaleString()}</span>
          <button 
            className="btn btn-primary" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            style={{ opacity: product.stock <= 0 ? 0.5 : 1, cursor: product.stock <= 0 ? 'not-allowed' : 'pointer' }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
