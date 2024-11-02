const express = require('express');
const { generateInvoice } = require('../controllers/invoiceController');

const router = express.Router();

router.post('/generate', generateInvoice);

module.exports = router;