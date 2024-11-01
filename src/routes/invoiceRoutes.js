const express = require('express');
const { generateInvoice } = require('../controllers/invoiceController');

const router = express.Router();

// POST route for generating an invoice
router.post('/generate', generateInvoice);

module.exports = router;