const express = require('express');
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCategories).post(protect, addCategory);
router.route('/:id').put(protect, updateCategory).delete(protect, deleteCategory);

module.exports = router;
