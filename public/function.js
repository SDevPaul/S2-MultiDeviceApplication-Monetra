// SCRIPTS HAVE BEEN TAKEN FROM CHATGPT AS WELL AS BEEN MODIFIED FROM MY OWN UNDERSTANDING

// Event listener for Add Expense Button
document.getElementById('add-expense-btn').addEventListener('click', async function () {
    const expenseValue = prompt("Enter expense amount:");

    if (expenseValue) {
        alert(`Adding Expense: $${expenseValue}`);

        // Send the expense data to the backend
        const response = await fetch('/add-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expense: expenseValue })
        });

        const data = await response.json();
        if (data.success) {
            alert('Expense added successfully!');
            updateBalance(); // Update the balance
            updateMonthlyIncome(); // Update monthly income
            updateMonthlyExpense(); // Update monthly expense
            displayTransactions(); // Update the transaction lists
        } else {
            alert('Error adding expense!');
        }
    }
});

// Event listener for Add Money Button
document.getElementById('add-money-btn').addEventListener('click', async function () {
    const moneyValue = prompt("Enter money amount:");

    if (moneyValue) {
        alert(`Adding Money: $${moneyValue}`);

        // Send the money data to the backend
        const response = await fetch('/add-money', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ money: moneyValue })
        });

        const data = await response.json();
        if (data.success) {
            alert('Money added successfully!');
            updateBalance(); // Update the balance
            updateMonthlyIncome(); // Update monthly income
            updateMonthlyExpense(); // Update monthly expense
            displayTransactions(); // Update the transaction lists
        } else {
            alert('Error adding money!');
        }
    }
});

// Function to fetch and display all transactions (expenses and money)
async function displayTransactions() {
    try {
        const response = await fetch('/view-transactions');
        const data = await response.json();

        if (data.success) {
            // const expenseContainer = document.getElementById('transaction-history');
            // const moneyContainer = document.getElementById('transaction-history');
            const transactionContainer = document.getElementById('transaction-history');
            transactionContainer.innerHTML = '';
            // expenseContainer.innerHTML = ''; // Clear existing list
            // moneyContainer.innerHTML = ''; // Clear existing list

            data.transactions.forEach(transaction => {
                const transactionItem = document.createElement('div');
                transactionItem.classList.add('transaction-item');
                transactionItem.innerHTML = `
                    <h3>${transaction.type}</h3>
                    <p class="text-xlarge"><b>Amount:</b> $${transaction.amount}</p>
                    <p class="text-small">Date: ${new Date(transaction.date).toLocaleString()}</p>
                    
                `;

                transactionContainer.appendChild(transactionItem);
                // if (transaction.type === 'expense') {
                //     expenseContainer.appendChild(transactionItem);
                // } else if (transaction.type === 'money') {
                //     moneyContainer.appendChild(transactionItem);
                // }
            });
        } else {
            console.log('Failed to fetch transactions');
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// Function to fetch and display the total balance
async function updateBalance() {
    try {
        const response = await fetch('/view-balance');
        const data = await response.json();

        if (data.success) {
            const totalbalanceElement = document.getElementById('total-balance');
            const balanceElement = document.querySelector('.balance p');
            totalbalanceElement.textContent = `$${data.balance.toFixed(2)}`; // Update total balance on the frontend
            balanceElement.textContent = `$${data.balance.toFixed(2)}`; // Update balance on the frontend
        } else {
            console.log('Failed to fetch balance');
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// Function to fetch and update monthly income
async function updateMonthlyIncome() {
    try {
        const response = await fetch('/view-monthly-income');
        const data = await response.json();

        if (data.success) {
            const monthlyIncomeElement = document.querySelector('.income p');
            monthlyIncomeElement.textContent = `$${data.monthly_income.toFixed(2)}`;
        } else {
            console.log('Failed to fetch monthly income');
        }
    } catch (error) {
        console.error('Error fetching monthly income:', error);
    }
}

// Function to fetch and update monthly expense
async function updateMonthlyExpense() {
    try {
        const response = await fetch('/view-monthly-expense');
        const data = await response.json();

        if (data.success) {
            const monthlyExpenseElement = document.querySelector('.expenses p');
            monthlyExpenseElement.textContent = `$${data.monthly_expense.toFixed(2)}`;
        } else {
            console.log('Failed to fetch monthly expense');
        }
    } catch (error) {
        console.error('Error fetching monthly expense:', error);
    }
}

// Fetch transactions, balance, monthly income and expense on page load
window.addEventListener('DOMContentLoaded', () => {
    displayTransactions();
    updateBalance();
    updateMonthlyIncome();
    updateMonthlyExpense();
});
