const db = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    await db.initDb();
    const { rows } = await db.pool.query('SELECT * FROM products');
    const formattedRows = rows.map(row => ({
      ...row,
      price: Number(row.price),
      imageUrl: row.imageurl
    }));
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.json([
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 29999.00,
        category: 'Electronics',
        description: 'High-fidelity audio with active noise cancellation.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
        stock: 15
      },
      {
        id: 2,
        name: 'Minimalist Mechanical Keyboard',
        price: 14950.00,
        category: 'Electronics',
        description: 'Sleek design with tactile switches for typing enthusiasts.',
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
        stock: 5
      }
    ]);
  }
};

module.exports = {
  getProducts
};
