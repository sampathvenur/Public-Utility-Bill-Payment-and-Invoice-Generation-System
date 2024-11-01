const express = require('express');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to serve static files
app.use(express.static('public'));

// Routes
app.use('/api/invoices', invoiceRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));