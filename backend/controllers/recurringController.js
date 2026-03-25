const asyncHandler = require('express-async-handler');
const RecurringTransaction = require('../models/RecurringTransaction');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc    Get all recurring transactions for user
// @route   GET /api/recurring
// @access  Private
const getRecurringTransactions = asyncHandler(async (req, res) => {
  const recurring = await RecurringTransaction.find({ user: req.user._id });
  res.json(recurring);
});

// @desc    Create a recurring transaction
// @route   POST /api/recurring
// @access  Private
const createRecurringTransaction = asyncHandler(async (req, res) => {
  const { type, title, amount, category, frequency, startDate } = req.body;

  const nextOccurrence = new Date(startDate);

  const recurring = await RecurringTransaction.create({
    user: req.user._id,
    type,
    title,
    amount,
    category,
    frequency,
    startDate,
    nextOccurrence,
  });

  res.status(201).json(recurring);
});

// @desc    Delete a recurring transaction
// @route   DELETE /api/recurring/:id
// @access  Private
const deleteRecurringTransaction = asyncHandler(async (req, res) => {
  const recurring = await RecurringTransaction.findById(req.params.id);

  if (recurring) {
    if (recurring.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }
    await recurring.remove();
    res.json({ message: 'Recurring transaction removed' });
  } else {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }
});

// Helper function to process recurring transactions
const processRecurringTransactions = async () => {
  const now = new Date();
  const dueTransactions = await RecurringTransaction.find({
    isActive: true,
    nextOccurrence: { $lte: now },
  });

  for (const rt of dueTransactions) {
    // Create actual transaction
    if (rt.type === 'expense') {
      await Expense.create({
        user: rt.user,
        title: rt.title,
        amount: rt.amount,
        category: rt.category,
        date: rt.nextOccurrence,
      });
    } else {
      await Income.create({
        user: rt.user,
        title: rt.title,
        amount: rt.amount,
        source: rt.category,
        date: rt.nextOccurrence,
      });
    }

    // Update next occurrence
    const next = new Date(rt.nextOccurrence);
    if (rt.frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (rt.frequency === 'weekly') next.setDate(next.getDate() + 7);
    else if (rt.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    else if (rt.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

    rt.lastProcessed = rt.nextOccurrence;
    rt.nextOccurrence = next;
    await rt.save();
  }
};

module.exports = {
  getRecurringTransactions,
  createRecurringTransaction,
  deleteRecurringTransaction,
  processRecurringTransactions,
};
