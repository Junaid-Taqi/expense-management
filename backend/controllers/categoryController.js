const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories for the logged in user
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
});

// @desc    Add a new category
// @route   POST /api/categories
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
  const { name, icon, color } = req.body;

  const categoryExists = await Category.findOne({ user: req.user._id, name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = new Category({
    user: req.user._id,
    name,
    icon,
    color,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name, icon, color } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    if (category.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    category.name = name || category.name;
    category.icon = icon || category.icon;
    category.color = color || category.color;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    if (category.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
