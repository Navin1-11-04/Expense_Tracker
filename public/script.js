let expenses = [];

        const form = document.getElementById('expenseForm');
        const expenseList = document.getElementById('expenseList');
        let editingExpenseId = null;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);

            if(editingExpenseId) {
                await updateExpense(editingExpenseId, description, amount);
                editingExpenseId = null;
            } else {
                await addExpense(description, amount);
            }
            getExpenses();
            form.reset();
        });

        async function getExpenses() {
            const response = await fetch('/api/expenses');
            if (response.ok) {
                expenses = await response.json();
                renderExpenses(expenses);
                totalExpense();
            }
        }

        async function addExpense(description, amount) {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ description, amount })
            });
            if (!response.ok) {
                console.log("Failed to add expense");
            }
        }

        async function deleteExpense(id) {
            await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
            getExpenses();
        }

        async function updateExpense(id, description, amount) {
            await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description, amount })
            });
        }

        function renderExpenses() {
            expenseList.innerHTML = '';
            let th = document.createElement('tr');
            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            let th3 = document.createElement('th');
            th1.textContent = "Description";
            th2.textContent = "Amount";
            th3.textContent = "Action";
            th.appendChild(th1);
            th.appendChild(th2);
            th.appendChild(th3);
            expenseList.appendChild(th);
            expenses.forEach((expense) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');

                td1.textContent = expense.description;
                td2.textContent = expense.amount.toFixed(2);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteExpense(expense._id);

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';

                editButton.onclick = () => editExpense(expense._id, expense.description, expense.amount);
                deleteButton.classList.add('delete');
                editButton.classList.add('edit');
                td3.appendChild(deleteButton);
                td3.appendChild(editButton);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                expenseList.appendChild(tr);
            });
        }

        function totalExpense() {
            let total = 0;
            expenses.forEach((item) => {
                total += item.amount;
            });
            document.getElementById('totalExpense').textContent = total.toFixed(2);
        }

        function editExpense(id, description, amount) {
            document.getElementById('description').value = description;
            document.getElementById('amount').value = amount;
            editingExpenseId = id;
        }

        getExpenses();