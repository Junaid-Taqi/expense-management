const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get all expenses for the logged in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  res.json(expenses);
});

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  const expense = new Expense({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    description,
  });

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  const expense = await Expense.findById(req.params.id);

  if (expense) {
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    expense.title = title !== undefined ? title : expense.title;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category !== undefined ? category : expense.category;
    expense.date = date !== undefined ? date : expense.date;
    expense.description = description !== undefined ? description : expense.description;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } else {
    res.status(404);
    throw new Error('Expense not found');
  }
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (expense) {
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense removed' });
  } else {
    res.status(404);
    throw new Error('Expense not found');
  }
});

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};
