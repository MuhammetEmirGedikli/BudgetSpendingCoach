# Budget & Spending Coach

**Budget & Spending Coach** is a simple web-based personal finance tracker designed for students and young adults. The main goal of this project is to help users record their income and expenses, organize spending by category, and understand their monthly financial situation through a clear and visual interface.

This project was created as an interdisciplinary student project combining **Computer Science** with **Economics / Personal Finance**.

---

## Project Purpose

Many students have difficulty managing their money effectively. They often spend money without tracking where it goes, which can lead to poor budgeting decisions.

Budget & Spending Coach provides a simple and student-friendly solution for tracking personal finances. Users can add income, add expenses, view category-based spending, check their remaining balance, and receive simple financial advice based on their spending behavior.

---

## Target Users

The main target users of this application are:

- University students
- Young adults managing a limited monthly budget
- Users who want a simple and visual way to track daily spending

---

## Features

The application includes the following features:

- Add income records
- Add expense records
- Categorize expenses
- Calculate total income
- Calculate total expenses
- Calculate remaining balance
- View transaction count
- View recent transactions
- Delete transactions
- View category-based spending
- View spending percentages with progress bars
- View a simple donut-style spending chart
- Select a month and view monthly summary
- See the most expensive category for the selected month
- Receive simple financial advice
- Save data using localStorage
- Load saved data after refreshing the page
- View a simple Kanban board in the About Project section

---

## Pages / Sections

### Dashboard

The dashboard displays the main financial overview:

- Total Income
- Total Expenses
- Remaining Balance
- Number of Transactions
- Spending by Category
- Recent Transactions
- Financial Advice

The dashboard updates automatically whenever the user adds or deletes a transaction.

---

### Add Income

The Add Income section allows the user to add a new income record.

The user enters:

- Income source
- Amount
- Date

Example income sources:

- Scholarship
- Part-time job
- Family support
- Freelance work

---

### Add Expense

The Add Expense section allows the user to add a new expense record.

The user enters:

- Expense title
- Category
- Amount
- Date

Available expense categories:

- Food
- Transport
- Rent
- Entertainment
- Bills
- Education
- Other

---

### Categories

The Categories section shows how much money was spent in each expense category.

It displays:

- Category name
- Total amount spent
- Percentage of total expenses
- Progress bar visualization

This helps users understand which category takes the biggest part of their budget.

---

### Monthly Summary

The Monthly Summary section allows the user to select a month and see financial activity for that month.

It shows:

- Monthly income
- Monthly expenses
- Monthly balance
- Most expensive category
- Number of income records
- Number of expense records
- Monthly financial advice

---

### Transactions

The Transactions section lists all income and expense records.

Each transaction includes:

- Type
- Title or source
- Category, if it is an expense
- Date
- Amount
- Delete button

When a transaction is deleted, all totals and summaries are updated automatically.

---

### About Project

The About Project section explains:

- Project purpose
- Target users
- Problem identification
- Interdisciplinary aspect
- Development plan
- Kanban project management method

---

## Technologies Used

This project was built using only basic web technologies:

- HTML
- CSS
- JavaScript

No external frameworks, backend, database, or APIs were used. The project is designed to be simple, understandable, and suitable for a student-level presentation.

---

## How the Application Works

The main logic of the application is based on a JavaScript array called `transactions`.

Each income or expense is stored as a transaction object.

Example income object:

```js
{
  id: Date.now(),
  type: "income",
  title: "Scholarship",
  amount: 1200,
  date: "2026-01-10"
}
