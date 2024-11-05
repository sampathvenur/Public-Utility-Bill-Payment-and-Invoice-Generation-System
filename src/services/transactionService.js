const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
// const path = require('path');
const csvFilePath = path.join(__dirname, '../logs/daily_transactions.csv');
const overdueFilePath = path.join(__dirname, '../logs/overdue_payments.json');

// Define the path for transaction records
const transactionFilePath = path.join(__dirname, '../data/transactionRecords.json');

class Stack {
    constructor() {
        this.items = [];
    }

    // Add a transaction to the stack
    push(transaction) {
        this.items.push(transaction);
    }

    // Remove and return the most recent transaction
    pop() {
        if (this.isEmpty()) return 'No transactions to undo';
        return this.items.pop();
    }

    // Return the most recent transaction without removing it
    peek() {
        return this.isEmpty() ? 'No transactions' : this.items[this.items.length - 1];
    }

    // Check if stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // View all transactions
    getTransactions() {
        return this.items;
    }
}

// Simulate payment processing with a delay
async function processPayment(request) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Processed payment for ${request.service} - Amount: ${request.amount}`);
            resolve();
        }, 2000); // Simulates a 2-second delay in processing
    });
}

// Save transaction to JSON file
async function saveTransactionToFile(transaction) {
    try {
        // Check if file exists
        if (fs.existsSync(transactionFilePath)) {
            // Read the existing file
            const data = JSON.parse(fs.readFileSync(transactionFilePath, 'utf-8'));
            data.push(transaction); // Append new transaction
            fs.writeFileSync(transactionFilePath, JSON.stringify(data, null, 2));
        } else {
            // If file doesn't exist, create it with the first transaction
            fs.writeFileSync(transactionFilePath, JSON.stringify([transaction], null, 2));
        }
        console.log('Transaction saved to file.');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

// Function to generate PDF invoice
async function generatePDFInvoice(transaction) {
    return new Promise((resolve, reject) => {
        try {
            // Create a new PDF document
            const doc = new PDFDocument();
            const invoicePath = path.join(__dirname, `../invoices/invoice_${transaction.id}.pdf`);
            const writeStream = fs.createWriteStream(invoicePath);
            doc.pipe(writeStream);

            // Add some content to the PDF
            doc.fontSize(20).text('Utility Bill Payment Invoice', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Transaction ID: ${transaction.id}`);
            doc.text(`User ID: ${transaction.userId}`);
            doc.text(`Utility Type: ${transaction.utilityType}`);
            doc.text(`Amount: ${transaction.amount}`);
            doc.text(`Date: ${transaction.date}`);
            doc.moveDown();
            doc.text('Thank you for your payment!', { align: 'center' });

            // Finalize the PDF and end the stream
            doc.end();

            writeStream.on('finish', () => {
                console.log('Invoice PDF generated:', invoicePath);
                resolve(invoicePath);
            });

            writeStream.on('error', (error) => {
                console.error('Error generating PDF invoice:', error);
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Function to log transaction details in .csv format
async function logTransactionToCSV(transaction) {
    const csvData = `${transaction.id},${transaction.userId},${transaction.utilityType},${transaction.amount},${transaction.date}\n`;

    return new Promise((resolve, reject) => {
        fs.appendFile(csvFilePath, csvData, (err) => {
            if (err) {
                console.error('Error logging transaction to CSV:', err);
                reject(err);
            } else {
                console.log('Transaction logged to CSV:', csvFilePath);
                resolve(csvFilePath);
            }
        });
    });
}

// Helper function to check if a transaction is overdue
function isOverdue(transaction) {
    const today = new Date();
    const dueDate = new Date(transaction.dueDate); // Ensure dueDate is part of transaction data
    return today > dueDate;
}

// Function to log overdue transaction details in .json format
async function logOverdueTransaction(transaction) {
    const data = { id: transaction.id, userId: transaction.userId, utilityType: transaction.utilityType, amount: transaction.amount, dueDate: transaction.dueDate, overdueDate: new Date() };

    return new Promise((resolve, reject) => {
        fs.readFile(overdueFilePath, 'utf8', (err, fileData) => {
            let overdueTransactions = [];
            if (!err && fileData) {
                overdueTransactions = JSON.parse(fileData);
            }
            overdueTransactions.push(data);

            fs.writeFile(overdueFilePath, JSON.stringify(overdueTransactions, null, 2), (err) => {
                if (err) {
                    console.error('Error logging overdue transaction:', err);
                    reject(err);
                } else {
                    console.log('Overdue transaction logged:', overdueFilePath);
                    resolve(overdueFilePath);
                }
            });
        });
    });
}


// Export an instance of the Stack
const transactionHistory = new Stack();
module.exports = transactionHistory;

module.exports = { transactionHistory, processPayment };

module.exports = { transactionHistory, processPayment, saveTransactionToFile };

module.exports = { transactionHistory, processPayment, saveTransactionToFile, generatePDFInvoice };

module.exports = { transactionHistory, processPayment, saveTransactionToFile, generatePDFInvoice, logTransactionToCSV };

module.exports = { transactionHistory, processPayment, saveTransactionToFile, generatePDFInvoice, logTransactionToCSV, logOverdueTransaction };