const pdfService = require('../services/pdfService');
const fs = require('fs');
const path = require('path');

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

        // Transaction record should be created after successfully generating the PDF
        const transactionRecord = {
            name,
            utilityType,
            amount,
            dueDate: new Date(dueDate).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        };

        // Path to the transactions file
        const transactionsFilePath = path.join(__dirname, '../data/transactions.json');

        // Read existing transactions
        fs.readFile(transactionsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading transactions file:', err);
                return;
            }

            const transactions = data ? JSON.parse(data) : [];
            transactions.push(transactionRecord);

            // Write updated transactions back to the file
            fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing transactions file:', err);
                } else {
                    console.log('Transaction recorded successfully:', transactionRecord);
                }
            });
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${name}-invoice.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating invoice:", error.message, error.stack);
        res.status(500).send('Error generating invoice');
    }       
};
