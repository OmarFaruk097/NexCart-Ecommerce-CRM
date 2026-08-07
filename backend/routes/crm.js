const express = require('express');
const router = express.Router();
const { getCustomers, getAllOrders, updateOrderStatus, addProduct, editProduct, deleteProduct } = require('../controllers/crmController');
const { getAllTickets, updateTicketStatus } = require('../controllers/supportController');

router.get('/customers', getCustomers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);

// CRM Support Routes
router.get('/support', getAllTickets);
router.put('/support/:id', updateTicketStatus);

module.exports = router;
