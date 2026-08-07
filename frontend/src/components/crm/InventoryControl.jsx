import React, { useState, useEffect } from 'react';

const InventoryControl = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });

  const fetchProducts = () => {
    fetch('http://https://nexcart-ecommerce-crm.onrender.com:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProd = { ...formData, price: parseFloat(formData.price) || 0, stock: parseInt(formData.stock) || 0 };

    try {
      const res = await fetch('http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        alert('Product added successfully!');
        setFormData({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Current Inventory</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={p.imageUrl || p.imageurl}
                  alt={p.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div>
                  <strong>{p.name}</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>৳{Number(p.price).toLocaleString()} - {p.category} - Stock: {p.stock}</div>
                </div>
              </div>
              <button onClick={() => handleDeleteProduct(p.id)} className="btn-remove">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Product</h2>
        <form onSubmit={handleAddProduct} style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Price (৳)</label>
            <input type="number" step="0.01" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input type="text" name="category" className="form-input" value={formData.category} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input type="url" name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleInputChange} required placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default InventoryControl;
