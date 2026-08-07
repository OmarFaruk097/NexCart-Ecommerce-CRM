const db = require('../config/db');

// @desc    Submit a new order
// @route   POST /api/orders
// @access  Public (should be private in real app)
const createOrder = async (req, res) => {
  const { userId, items, shippingDetails, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const orderId = `ORD-${Date.now()}`;
  let uId = userId;
  if (uId === 'guest') uId = null;

  try {
    await db.initDb();
    // 1. Insert into orders table
    await db.pool.query(
      `INSERT INTO orders (id, user_id, total, status, shipping_name, shipping_address, shipping_city, shipping_zip) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        orderId, 
        uId, 
        total, 
        'Processing', 
        shippingDetails.fullName, 
        shippingDetails.address, 
        shippingDetails.city, 
        shippingDetails.zipCode
      ]
    );

    // 2. Insert into order_items table and update stock
    for (const item of items) {
      await db.pool.query(
        `INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ($1, $2, $3, $4)`,
        [orderId, item.name, item.price, item.quantity]
      );
      
      // Update inventory stock
      if (item.id) {
        await db.pool.query(
          `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
          [item.quantity, item.id]
        );
      }
    }

    res.status(201).json({ id: orderId, status: 'Processing', total });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user/:userId
// @access  Public (should be private)
const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  
  try {
    await db.initDb();
    // Fetch orders
    const { rows: orders } = await db.pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    
    // Fetch items for each order
    for (let order of orders) {
      const { rows: items } = await db.pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      order.total = Number(order.total);
      order.items = items.map(item => ({ 
        ...item, 
        name: item.product_name,
        price: Number(item.price) 
      }));
      // map shippingDetails back to the object structure React expects
      order.shippingDetails = {
        fullName: order.shipping_name,
        address: order.shipping_address,
        city: order.shipping_city,
        zipCode: order.shipping_zip
      };
      order.createdAt = order.created_at;
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getUserOrders
};
