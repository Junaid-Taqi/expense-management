const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');

// @desc    Get all incomes for the logged in user
// @route   GET /api/incomes
// @access  Private
const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ user: req.user._id });
  res.json(incomes);
});

// @desc    Add a new income
// @route   POST /api/incomes
// @access  Private
const addIncome = asyncHandler(async (req, res) => {
  const { title, amount, source, date, description } = req.body;

  const income = new Income({
    user: req.user._id,
    title,
    amount,
    source,
    date,
    description,
  });

  const createdIncome = await income.save();
  res.status(201).json(createdIncome);
});

// @desc    Update an income
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  const { title, amount, source, date, description } = req.body;

  const income = await Income.findById(req.params.id);

  if (income) {
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    income.title = title !== undefined ? title : income.title;
    income.amount = amount !== undefined ? amount : income.amount;
    income.source = source !== undefined ? source : income.source;
    income.date = date !== undefined ? date : income.date;
    income.description = description !== undefined ? description : income.description;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } else {
    res.status(404);
    throw new Error('Income not found');
  }
});

// @desc    Delete an income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (income) {
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Income.deleteOne({ _id: req.params.id });
    res.json({ message: 'Income removed' });
  } else {
    res.status(404);
    throw new Error('Income not found');
  }
});

module.exports = {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
};
