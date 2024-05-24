document.addEventListener('DOMContentLoaded', () => {
    const transactions = [];
    let transactionId = 0;

    const form = document.getElementById('transaction-form');
    const table = document.getElementById('transaction-table').getElementsByTagName('tbody')[0];
    const totalElement = document.getElementById('total');
    const detailsElement = document.getElementById('transaction-details');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addTransaction();
    });

    table.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const id = parseInt(event.target.dataset.id, 10);
            deleteTransaction(id);
        } else if (event.target.closest('tr')) {
            const id = parseInt(event.target.closest('tr').dataset.id, 10);
            displayTransactionDetails(id);
        }
    });

    /**
     * Добавляет транзакцию в массив и таблицу.
     */
    function addTransaction() {
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const date = new Date().toLocaleString();

        const transaction = {
            id: ++transactionId,
            date,
            amount,
            category,
            description
        };

        transactions.push(transaction);
        addTransactionToTable(transaction);
        calculateTotal();
        form.reset();
    }

    /**
     * Добавляет строку с транзакцией в таблицу.
     * @param {Object} transaction Объект транзакции.
     */
    function addTransactionToTable(transaction) {
        const row = document.createElement('tr');
        row.dataset.id = transaction.id;
        row.className = transaction.amount >= 0 ? 'income' : 'expense';

        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description.split(' ').slice(0, 4).join(' ')}</td>
            <td><button class="delete-button" data-id="${transaction.id}">Удалить</button></td>
        `;

        table.appendChild(row);
    }

    /**
     * Удаляет транзакцию из массива и таблицы.
     * @param {number} id Идентификатор транзакции.
     */
    function deleteTransaction(id) {
        const index = transactions.findIndex(transaction => transaction.id === id);
        if (index !== -1) {
            transactions.splice(index, 1);
            document.querySelector(`tr[data-id="${id}"]`).remove();
            calculateTotal();

            // Скрытие деталей транзакции, если удаляемая транзакция отображается в деталях
            if (detailsElement.dataset.id == id) {
                detailsElement.innerHTML = '';
                detailsElement.removeAttribute('data-id');
            }
        }
    }

    /**
     * Рассчитывает и отображает общую сумму всех транзакций.
     */
    function calculateTotal() {
        const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        totalElement.textContent = `Общая сумма: ${total}`;
    }

    /**
     * Отображает подробное описание транзакции.
     * @param {number} id Идентификатор транзакции.
     */
    function displayTransactionDetails(id) {
        const transaction = transactions.find(transaction => transaction.id === id);
        if (transaction) {
            detailsElement.dataset.id = id;
            detailsElement.innerHTML = `
                <h2>Подробности транзакции</h2>
                <p>ID: ${transaction.id}</p>
                <p>Дата и время: ${transaction.date}</p>
                <p>Сумма: ${transaction.amount}</p>
                <p>Категория: ${transaction.category}</p>
                <p>Описание: ${transaction.description}</p>
            `;
        }
    }
});
