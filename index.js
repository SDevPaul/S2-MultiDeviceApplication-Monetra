const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SCRIPTS HAVE BEEN TAKEN FROM CHATGPT AS WELL AS BEEN MODIFIED FROM MY OWN UNDERSTANDING


// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Setup SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'expenses.db'), (err) => {
    if (err) {
        console.error('Could not open database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create expenses and balance table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL
    );
`);



// Route to handle adding an expense
app.post('/add-expense', (req, res) => {
    const { expense } = req.body;

    if (!expense || isNaN(expense)) {
        return res.status(400).json({ success: false, message: 'Valid expense amount is required' });
    }

    const query = `INSERT INTO expenses (amount, date, type) VALUES (?, ?, ?)`;
    const date = new Date().toISOString();
    const type = 'Expense';

    db.run(query, [expense, date, type], function (err) {
        if (err) {
            console.error('Error inserting expense:', err.message);
            return res.status(500).json({ success: false, message: 'Error adding expense' });
        }
        res.status(200).json({ success: true, message: 'Expense added successfully!' });
    });
});

// Route to handle adding money
app.post('/add-money', (req, res) => {
    const { money } = req.body;

    if (!money || isNaN(money)) {
        return res.status(400).json({ success: false, message: 'Valid money amount is required' });
    }

    const query = `INSERT INTO expenses (amount, date, type) VALUES (?, ?, ?)`;
    const date = new Date().toISOString();
    const type = 'Money';

    db.run(query, [money, date, type], function (err) {
        if (err) {
            console.error('Error inserting money:', err.message);
            return res.status(500).json({ success: false, message: 'Error adding money' });
        }
        res.status(200).json({ success: true, message: 'Money added successfully!' });
    });
});

// Route to fetch all transactions (expenses and money)
app.get('/view-transactions', (req, res) => {
    db.all("SELECT * FROM expenses ORDER BY date DESC", [], (err, rows) => {
        if (err) {
            console.error('Error retrieving transactions:', err.message);
            return res.status(500).json({ success: false, message: 'Error retrieving transactions' });
        }
        res.json({ success: true, transactions: rows });
    });
});

// Route to get the total balance
app.get('/view-balance', (req, res) => {
    const query = `
        SELECT 
            COALESCE(SUM(CASE WHEN type = 'Money' THEN amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS balance
        FROM expenses
    `;

    db.get(query, [], (err, row) => {
        if (err) {
            console.error('Error retrieving balance:', err.message);
            return res.status(500).json({ success: false, message: 'Error retrieving balance' });
        }
        res.json({ success: true, balance: row.balance });
    });
});

// Route to get monthly income (sum of all money added)
app.get('/view-monthly-income', (req, res) => {
    db.get("SELECT SUM(amount) AS monthly_income FROM expenses WHERE type = 'Money'", [], (err, row) => {
        if (err) {
            console.error('Error retrieving monthly income:', err.message);
            return res.status(500).json({ success: false, message: 'Error retrieving monthly income' });
        }
        res.json({ success: true, monthly_income: row.monthly_income || 0 });
    });
});

// Route to get monthly expense (sum of all expenses)
app.get('/view-monthly-expense', (req, res) => {
    db.get("SELECT SUM(amount) AS monthly_expense FROM expenses WHERE type = 'Expense'", [], (err, row) => {
        if (err) {
            console.error('Error retrieving monthly expense:', err.message);
            return res.status(500).json({ success: false, message: 'Error retrieving monthly expense' });
        }
        res.json({ success: true, monthly_expense: row.monthly_expense || 0 });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
