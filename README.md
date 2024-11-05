# Public Utility Bill Payment and Invoice Generation System

## Overview
This project is a Public Utility Bill Payment and Invoice Generation System designed to facilitate the timely payment of utility bills (electricity, water, gas) for citizens of Mangalore. It aims to streamline the bill payment process, manage transactions, and generate invoices in PDF format.

## Features
- **Invoice Generation**: Generate invoices for utility bills with relevant details (name, utility type, amount due, due date).
- **Transaction Logging**: Record daily transactions and overdue payments for auditing purposes.
- **Data Management**: Utilize stacks and queues to manage transaction history and incoming payment requests.
- **User-friendly Interface**: A simple HTML form to input utility payment details and generate invoices.

## Technologies Used
- **Node.js**: Backend framework for building the server.
- **Express.js**: Framework for creating APIs.
- **PDF Generation**: Service to create PDF invoices.
- **File System (fs)**: For reading and writing transaction records.
- **HTML/CSS**: For the frontend user interface.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sampathvenur/Public-Utility-Bill-Payment-and-Invoice-Generation-System.git
   cd Public Utility Bill Payment and Invoice Generation System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `data` directory and initialize an empty `transactions.json` file:
   ```bash
   mkdir src/data
   touch src/data/transactions.json
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000`.

## Usage
1. Fill in the invoice form with your name, utility type, amount due, and due date.
2. Click on "Generate Invoice" to create your invoice.
3. The invoice will be downloaded as a PDF file.
4. All transactions will be logged in `transactions.json` for record-keeping.

## Contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License
This project is licensed under the Sampy's Licence Policy. See the LICENSE file for more information.

## Acknowledgements
- Special thanks to the TCE Instructors and peers who provided guidance throughout this project.

## Contact
For any inquiries, please contact:
- **Name**: Sampath Kumar
- **Email**: sampathkumarvenur@gmail.com
