const PDFDocument = require('pdfkit');

exports.createInvoicePDF = ({ name, utilityType, amount, dueDate }) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.on('error', (err) => {
            console.error("PDF generation error:", err); // Log PDF generation error
            reject(err);
        });

        // PDF content
        doc.fontSize(18).text('Public Utility Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12)
            .text(`Name: ${name}`, { align: 'left' })
            .moveDown()
            .text(`Utility: ${utilityType}`, { align: 'left' })
            .moveDown()
            .text(`Amount Due: $${amount.toFixed(2)}`, { align: 'left' })
            .moveDown()
            .text(`Due Date: ${dueDate}`, { align: 'left' });

        doc.end();
    });
};
