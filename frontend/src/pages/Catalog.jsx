import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    // Fetch products from our Node.js backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://https://nexcart-ecommerce-crm.onrender.comhttps://nexcart-ecommerce-crm.onrender.com/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Is the backend server running?');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Loading products...</h2></div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary-color)' }}><h2>{error}</h2></div>;

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <h1 className="page-title">Discover Our Premium Collection</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
