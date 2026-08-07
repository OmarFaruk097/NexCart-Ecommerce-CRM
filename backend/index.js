require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDb().then(() => {
  const seedScript = path.join(__dirname, 'seedProducts.js');

  const seedProcess = spawn(process.execPath, [seedScript], {
    cwd: __dirname,
    stdio: 'ignore',
  });

  seedProcess.on('close', () => {
    console.log('Demo products seeded if needed.');
  });
});

// Middleware
app.use(cors({
  origin: "https://nex-cart-ecommerce-crm.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const crmRoutes = require('./routes/crm');
const supportRoutes = require('./routes/supportRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/support', supportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('E-commerce & CRM API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});