const pdfService = require('../services/pdfService');

exports.generateInvoice = async (req, res) => {
    const { name, utilityType, amount, dueDate } = req.body;

    // Input validation
    if (!name || !utilityType || !amount || !dueDate) {
        return res.status(400).send('All fields are required.');
    }

    if (isNaN(amount) || amount < 0) {
        return res.status(400).send('Amount must be a valid positive number.');
    }

    try {
        const pdfBuffer = await pdfService.createInvoicePDF({ name, utilityType, amount, dueDate });

        // Set headers to force download of PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${name}-invoice.pdf`
        });

        // Send the PDF buffer as response
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating invoice:", error.message, error.stack); // Log message and stack trace
        res.status(500).send('Error generating invoice');
    }       
};