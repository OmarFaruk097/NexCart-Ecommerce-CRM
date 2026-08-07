const db = require('../config/db');

// @desc    Get all customers (users)
// @route   GET /api/crm/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
  try {
    await db.initDb();
    const { rows } = await db.pool.query('SELECT id as _id, name, email, created_at as registeredAt FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/crm/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    await db.initDb();
    const { rows: orders } = await db.pool.query('SELECT id, user_id as userId, total, status, created_at as createdAt FROM orders ORDER BY created_at DESC');
    const formattedOrders = orders.map(order => ({
      ...order,
      total: Number(order.total)
    }));
    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/crm/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.initDb();
    await db.pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new product
// @route   POST /api/crm/products
// @access  Private/Admin
const addProduct = async (req, res) => {
  const { name, price, category, description, imageUrl, stock } = req.body;
  try {
    await db.initDb();
    const { rows: inserted } = await db.pool.query(
      'INSERT INTO products (name, price, category, description, imageUrl, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, price, category, description, imageUrl, stock || 0]
    );
    res.status(201).json({ message: 'Product created successfully', product: { id: inserted[0].id, ...req.body } });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Edit a product
// @route   PUT /api/crm/products/:id
// @access  Private/Admin
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, imageUrl, stock } = req.body;
  try {
    await db.initDb();
    await db.pool.query(
      'UPDATE products SET name=$1, price=$2, category=$3, description=$4, imageUrl=$5, stock=$6 WHERE id=$7',
      [name, price, category, description, imageUrl, stock, id]
    );
    res.json({ message: `Product ${id} updated successfully` });
  } catch (err) {
    console.error('Error editing product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/crm/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.initDb();
    await db.pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: `Product ${id} deleted successfully` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCustomers,
  getAllOrders,
  updateOrderStatus,
  addProduct,
  editProduct,
  deleteProduct
};
