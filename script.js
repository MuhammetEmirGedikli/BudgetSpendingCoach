const STORAGE_KEY = "budgetCoachTransactions";

const categories = [
  "Food",
  "Transport",
  "Rent",
  "Entertainment",
  "Bills",
  "Education",
  "Other"
];

const categoryColors = {
  Food: "#28b8a8",
  Transport: "#2f80ed",
  Rent: "#7357d8",
  Entertainment: "#ef5d7a",
  Bills: "#f2a93b",
  Education: "#3fb66f",
  Other: "#78849a"
};

let transactions = [];

document.addEventListener("DOMContentLoaded", function () {
  loadTransactions();
  prepareForms();
  prepareNavigation();
  renderKanbanBoard();
  renderAll();
});

function prepareForms() {
  document.getElementById("incomeForm").addEventListener("submit", addIncome);
  document.getElementById("expenseForm").addEventListener("submit", addExpense);
  document.getElementById("monthSelector").addEventListener("change", renderMonthlySummary);

  document.getElementById("incomeDate").value = getToday();
  document.getElementById("expenseDate").value = getToday();
  document.getElementById("monthSelector").value = getCurrentMonth();

  const select = document.getElementById("expenseCategory");
  const chips = document.getElementById("expenseCategoryChips");

  categories.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);

    const chip = document.createElement("span");
    chip.className = "category-chip";
    chip.textContent = category;
    chips.appendChild(chip);
  });
}

function prepareNavigation() {
  document.querySelectorAll("[data-page]").forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-page-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.dataset.pageTarget);
    });
  });

  document.getElementById("allTransactions").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      deleteTransaction(event.target.dataset.id);
    }
  });
}

function loadTransactions() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData) {
    try {
      transactions = JSON.parse(savedData);
      if (!Array.isArray(transactions)) {
        transactions = createDemoTransactions();
        saveTransactions();
      }
    } catch (error) {
      transactions = createDemoTransactions();
      saveTransactions();
    }
  } else {
    transactions = createDemoTransactions();
    saveTransactions();
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function createDemoTransactions() {
  const month = getCurrentMonth();
  const makeDate = function (day) {
    return month + "-" + String(day).padStart(2, "0");
  };

  return [
    { id: 101, type: "income", title: "Scholarship", amount: 1200, date: makeDate(3) },
    { id: 102, type: "income", title: "Part-time Job", amount: 800, date: makeDate(12) },
    { id: 103, type: "expense", title: "Rent", category: "Rent", amount: 900, date: makeDate(4) },
    { id: 104, type: "expense", title: "Groceries", category: "Food", amount: 250, date: makeDate(9) },
    { id: 105, type: "expense", title: "Bus Ticket", category: "Transport", amount: 80, date: makeDate(10) },
    { id: 106, type: "expense", title: "Netflix", category: "Entertainment", amount: 45, date: makeDate(13) },
    { id: 107, type: "expense", title: "Books", category: "Education", amount: 120, date: makeDate(15) }
  ];
}

function addIncome(event) {
  event.preventDefault();

  const sourceInput = document.getElementById("incomeSource");
  const amountInput = document.getElementById("incomeAmount");
  const dateInput = document.getElementById("incomeDate");
  const message = document.getElementById("incomeMessage");

  const source = sourceInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  message.className = "form-message";

  if (source === "" || amount <= 0 || date === "") {
    message.textContent = "Please enter a source, amount greater than 0, and date.";
    return;
  }

  transactions.push({
    id: Date.now(),
    type: "income",
    title: source,
    amount: roundMoney(amount),
    date: date
  });

  saveTransactions();
  event.target.reset();
  dateInput.value = getToday();
  message.className = "form-message success";
  message.textContent = "Income added successfully.";
  renderAll();
}

function addExpense(event) {
  event.preventDefault();

  const titleInput = document.getElementById("expenseTitle");
  const categoryInput = document.getElementById("expenseCategory");
  const amountInput = document.getElementById("expenseAmount");
  const dateInput = document.getElementById("expenseDate");
  const message = document.getElementById("expenseMessage");

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  message.className = "form-message";

  if (title === "" || category === "" || amount <= 0 || date === "") {
    message.textContent = "Please enter a title, category, amount greater than 0, and date.";
    return;
  }

  transactions.push({
    id: Date.now(),
    type: "expense",
    title: title,
    category: category,
    amount: roundMoney(amount),
    date: date
  });

  saveTransactions();
  event.target.reset();
  dateInput.value = getToday();
  message.className = "form-message success";
  message.textContent = "Expense added successfully.";
  renderAll();
}

function deleteTransaction(id) {
  transactions = transactions.filter(function (transaction) {
    return String(transaction.id) !== String(id);
  });

  saveTransactions();
  renderAll();
}

function calculateTotals(list) {
  const data = list || transactions;
  let income = 0;
  let expenses = 0;

  data.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += Number(transaction.amount);
    } else {
      expenses += Number(transaction.amount);
    }
  });

  return {
    income: income,
    expenses: expenses,
    balance: income - expenses,
    count: data.length
  };
}

function renderAll() {
  renderDashboard();
  renderTransactions();
  renderCategories();
  renderMonthlySummary();
}

function renderDashboard() {
  const totals = calculateTotals(transactions);

  document.getElementById("totalIncome").textContent = formatMoney(totals.income);
  document.getElementById("totalExpenses").textContent = formatMoney(totals.expenses);
  document.getElementById("remainingBalance").textContent = formatMoney(totals.balance);
  document.getElementById("transactionCount").textContent = totals.count;
  document.getElementById("currentMonthLabel").textContent = formatMonthName(getCurrentMonth());

  renderDashboardCategoryChart();
  renderRecentTransactions();
  renderFinancialAdvice(totals);
}

function renderDashboardCategoryChart() {
  const chart = document.getElementById("dashboardCategoryChart");
  const donut = document.getElementById("donutChart");
  const centerText = document.getElementById("donutCenterText");
  const categoryTotals = getCategoryTotals(transactions);
  const totalExpenses = calculateTotals(transactions).expenses;

  chart.innerHTML = "";
  centerText.textContent = formatMoney(totalExpenses);

  if (totalExpenses === 0) {
    chart.innerHTML = '<div class="empty-state">No expenses yet. Add an expense to see the chart.</div>';
    donut.style.background = "conic-gradient(#e5e9f2 0 360deg)";
    return;
  }

  let currentDegree = 0;
  const gradientParts = [];

  categories.forEach(function (category) {
    const amount = categoryTotals[category];
    const percent = (amount / totalExpenses) * 100;
    const degrees = (percent / 100) * 360;
    const color = categoryColors[category];

    if (amount > 0) {
      gradientParts.push(color + " " + currentDegree + "deg " + (currentDegree + degrees) + "deg");
    }

    currentDegree += degrees;
    chart.appendChild(createBarRow(category, amount, percent, color));
  });

  donut.style.background = "conic-gradient(" + gradientParts.join(", ") + ")";
}

function renderRecentTransactions() {
  const container = document.getElementById("recentTransactions");
  const recent = getSortedTransactions().slice(0, 5);

  container.innerHTML = "";

  if (recent.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions yet.</div>';
    return;
  }

  recent.forEach(function (transaction) {
    container.appendChild(createTransactionElement(transaction, false));
  });
}

function renderFinancialAdvice(totals) {
  const advice = document.getElementById("financialAdvice");
  advice.className = "advice-box";
  const spendingIsCloseToIncome = totals.income > 0 && totals.expenses >= totals.income * 0.9;

  if (totals.balance > 0 && !spendingIsCloseToIncome) {
    advice.classList.add("good");
    advice.textContent = "Good job! You still have money left this month.";
  } else {
    advice.classList.add("warning");
    advice.textContent = "Be careful! Your expenses are close to or higher than your income.";
  }
}

function renderTransactions() {
  const container = document.getElementById("allTransactions");
  const sortedTransactions = getSortedTransactions();

  container.innerHTML = "";

  if (sortedTransactions.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions saved yet.</div>';
    return;
  }

  sortedTransactions.forEach(function (transaction) {
    container.appendChild(createTransactionElement(transaction, true));
  });
}

function renderCategories() {
  const container = document.getElementById("categoryList");
  const categoryTotals = getCategoryTotals(transactions);
  const totalExpenses = calculateTotals(transactions).expenses;

  container.innerHTML = "";

  categories.forEach(function (category) {
    const amount = categoryTotals[category];
    const percent = totalExpenses === 0 ? 0 : (amount / totalExpenses) * 100;
    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML =
      '<div class="category-info">' +
      '<strong>' + category + '</strong>' +
      '<span>' + formatMoney(amount) + ' - ' + percent.toFixed(0) + '%</span>' +
      '</div>' +
      '<div class="progress-track">' +
      '<div class="progress-fill" style="width: ' + percent + '%; background: ' + categoryColors[category] + ';"></div>' +
      '</div>';
    container.appendChild(row);
  });
}

function renderMonthlySummary() {
  const monthInput = document.getElementById("monthSelector");
  const selectedMonth = monthInput.value || getCurrentMonth();
  const monthlyTransactions = transactions.filter(function (transaction) {
    return transaction.date && transaction.date.startsWith(selectedMonth);
  });
  const totals = calculateTotals(monthlyTransactions);
  const incomeRecords = monthlyTransactions.filter(function (transaction) {
    return transaction.type === "income";
  }).length;
  const expenseRecords = monthlyTransactions.filter(function (transaction) {
    return transaction.type === "expense";
  }).length;
  const topCategory = getTopCategory(monthlyTransactions);

  if (!monthInput.value) {
    monthInput.value = selectedMonth;
  }

  document.getElementById("monthlyIncome").textContent = formatMoney(totals.income);
  document.getElementById("monthlyExpenses").textContent = formatMoney(totals.expenses);
  document.getElementById("monthlyBalance").textContent = formatMoney(totals.balance);
  document.getElementById("monthlyTopCategory").textContent = topCategory;
  document.getElementById("monthlyIncomeRecords").textContent = incomeRecords;
  document.getElementById("monthlyExpenseRecords").textContent = expenseRecords;

  renderMonthlyAdvice(totals);
}

function renderMonthlyAdvice(totals) {
  const advice = document.getElementById("monthlyAdvice");
  advice.className = "advice-box";

  if (totals.income === 0 && totals.expenses === 0) {
    advice.classList.add("warning");
    advice.textContent = "No records for this month yet. Add income and expenses to see advice.";
  } else if (totals.expenses < totals.income * 0.7) {
    advice.classList.add("good");
    advice.textContent = "Great! You are managing your monthly budget well.";
  } else if (totals.expenses <= totals.income) {
    advice.classList.add("warning");
    advice.textContent = "Warning: Your spending is getting close to your income.";
  } else {
    advice.classList.add("danger");
    advice.textContent = "Your expenses are higher than your income. Try to reduce unnecessary spending.";
  }
}

function renderKanbanBoard() {
  const board = document.getElementById("kanbanBoard");
  const columns = [
    {
      title: "To Do",
      cards: ["Improve monthly summary", "Add more sample data"]
    },
    {
      title: "In Progress",
      cards: ["Test form validation", "Improve dashboard design"]
    },
    {
      title: "Done",
      cards: ["Create dashboard", "Add income form", "Add expense form", "Add category summary"]
    }
  ];

  board.innerHTML = "";

  columns.forEach(function (column) {
    const columnElement = document.createElement("div");
    columnElement.className = "kanban-column";
    columnElement.innerHTML = "<h4>" + column.title + "</h4>";

    column.cards.forEach(function (card) {
      const cardElement = document.createElement("div");
      cardElement.className = "kanban-card";
      cardElement.textContent = card;
      columnElement.appendChild(cardElement);
    });

    board.appendChild(columnElement);
  });
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-link").forEach(function (button) {
    button.classList.remove("active");
  });

  document.getElementById(pageName).classList.add("active");
  document.querySelector('[data-page="' + pageName + '"]').classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getCategoryTotals(list) {
  const totals = {};

  categories.forEach(function (category) {
    totals[category] = 0;
  });

  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      const category = transaction.category || "Other";
      totals[category] += Number(transaction.amount);
    }
  });

  return totals;
}

function getTopCategory(list) {
  const categoryTotals = getCategoryTotals(list);
  let topCategory = "No expenses";
  let topAmount = 0;

  categories.forEach(function (category) {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategory = category;
    }
  });

  return topCategory;
}

function createBarRow(category, amount, percent, color) {
  const row = document.createElement("div");
  row.className = "bar-row";
  row.innerHTML =
    '<div class="bar-info">' +
    '<strong>' + category + '</strong>' +
    '<span>' + formatMoney(amount) + ' - ' + percent.toFixed(0) + '%</span>' +
    '</div>' +
    '<div class="progress-track">' +
    '<div class="progress-fill" style="width: ' + percent + '%; background: ' + color + ';"></div>' +
    '</div>';
  return row;
}

function createTransactionElement(transaction, showDeleteButton) {
  const item = document.createElement("div");
  item.className = "transaction-item";

  const isIncome = transaction.type === "income";
  const typeLabel = isIncome ? "Income" : "Expense";
  const categoryText = isIncome ? "No category" : transaction.category;
  const sign = isIncome ? "+" : "-";
  const shortType = isIncome ? "IN" : "EX";

  item.innerHTML =
    '<div class="transaction-title">' +
    '<div class="type-dot ' + transaction.type + '">' + shortType + '</div>' +
    '<div>' +
    '<strong>' + escapeHTML(transaction.title) + '</strong>' +
    '<span>' + typeLabel + (isIncome ? "" : " - " + categoryText) + '</span>' +
    '</div>' +
    '</div>' +
    '<div class="transaction-date">' + formatDate(transaction.date) + '</div>' +
    '<div class="transaction-amount ' + transaction.type + '">' + sign + formatMoney(transaction.amount) + '</div>';

  if (showDeleteButton) {
    const button = document.createElement("button");
    button.className = "delete-button";
    button.dataset.id = transaction.id;
    button.textContent = "Delete";
    item.appendChild(button);
  }

  return item;
}

function getSortedTransactions() {
  return transactions.slice().sort(function (a, b) {
    const dateDifference = new Date(b.date) - new Date(a.date);
    if (dateDifference !== 0) {
      return dateDifference;
    }
    return Number(b.id) - Number(a.id);
  });
}

function formatMoney(amount) {
  return Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) + " PLN";
}

function formatDate(dateText) {
  const date = new Date(dateText + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatMonthName(monthText) {
  const date = new Date(monthText + "-01T00:00:00");
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });
}

function getToday() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

function getCurrentMonth() {
  const today = new Date();
  return today.toISOString().slice(0, 7);
}

function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

// Small helper to keep user-entered titles safe when displayed in the page.
function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
