const express = require('express');
const router = express.Router();
const { submitTicket } = require('../controllers/supportController');

router.post('/', submitTicket);

module.exports = router;
