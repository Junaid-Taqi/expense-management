const Budget = require('../models/Budget');

// @desc    Get all budgets for logged in user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user._id };
    
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set or update budget for a category
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find if budget already exists for this category/month/year
    let budget = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year,
    });

    if (budget) {
      // Update existing
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        month,
        year,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (budget && budget.user.toString() === req.user._id.toString()) {
      await budget.deleteOne();
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  setBudget,
  deleteBudget,
};
