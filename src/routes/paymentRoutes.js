const express = require('express');
const { Queue, PriorityQueue } = require('../services/queueService');
const router = express.Router();
const { transactionHistory, processPayment } = require('../services/transactionService');
// Initialize queues
const regularQueue = new Queue();
const urgentQueue = new PriorityQueue();

// Route to handle regular payment requests
router.post('/payment', (req, res) => {
    const { userId, amount, billType } = req.body;

    // Add to regular queue
    regularQueue.enqueue({ userId, amount, billType });
    res.status(200).json({ message: 'Payment request added to the queue.' });
});

// Route to handle urgent payment requests
router.post('/payment/urgent', (req, res) => {
    const { userId, amount, billType, priority } = req.body;

    // Add to priority queue
    urgentQueue.enqueue({ userId, amount, billType }, priority || 1);
    res.status(200).json({ message: 'Urgent payment request added to the priority queue.' });
});

// Asynchronous Functions for Real-Time Processing
router.post('/process', async (req, res) => {
    try {
        let nextRequest;

        if (!urgentQueue.isEmpty()) {
            nextRequest = urgentQueue.dequeue();
        } else if (!regularQueue.isEmpty()) {
            nextRequest = regularQueue.dequeue();
        } else {
            return res.status(200).json({ message: 'No pending payment requests.' });
        }

        // Check if the transaction is overdue and log it if so
        if (isOverdue(nextRequest)) {
            await logOverdueTransaction(nextRequest);
        }

        // Process payment, add to history, log to CSV, etc.
        await processPayment(nextRequest);
        transactionHistory.push(nextRequest);
        await saveTransactionToFile(nextRequest);
        const invoicePath = await generatePDFInvoice(nextRequest);
        await logTransactionToCSV(nextRequest);

        res.status(200).json({ message: 'Payment processed, with logging for overdue transactions.', request: nextRequest, invoicePath });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
});

router.get('/transactions', (req, res) => {
    const transactions = transactionHistory.getTransactions();
    res.status(200).json({ transactions });
});

// Route to undo the last payment
router.post('/transactions/undo', (req, res) => {
    const undoneTransaction = transactionHistory.pop();
    res.status(200).json({ message: 'Last transaction undone', transaction: undoneTransaction });
});

module.exports = router;