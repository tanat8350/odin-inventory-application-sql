const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const categoryQueries = require('../db/categoryQueries');
const itemQueries = require('../db/itemQueries');

const notFoundHandler = (data, message) => {
  if (data === null) {
    const msg = message || 'Category not found';
    const err = new Error(msg);
    err.status = 404;
    return next(err);
  }
};

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryQueries.getAllCategories();
  res.render('category_list', { title: 'Categories', categories });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    categoryQueries.getCategory(req.params.id),
    itemQueries.getItemsByCategory(req.params.id),
  ]);

  notFoundHandler(category);

  res.render('category_detail', {
    title: category.name,
    category,
    items,
  });
});

exports.getCreateCategory = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create category' });
});

const validateForm = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('description').trim(),
];

exports.postCreateCategory = [
  validateForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = {
      name: req.body.name,
      description: req.body.description,
    };

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create category',
        category,
        errors: errors.array(),
      });
      return;
    }
    const created = await categoryQueries.createCategory(
      category.name,
      category.description
    );
    notFoundHandler(created, 'Error while creating category');
    res.redirect(`/category/${created.id}`);
  }),
];

exports.postDeleteCategory = asyncHandler(async (req, res, next) => {
  const deleted = await categoryQueries.deleteCategory(req.params.id);
  notFoundHandler(deleted, 'Error while deleting category');
  res.redirect('/category');
});

exports.getUpdateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryQueries.getCategory(req.params.id);
  notFoundHandler(category);
  res.render('category_form', { title: 'Update category', category });
});

exports.postUpdateCategory = [
  validateForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = {
      name: req.body.name,
      description: req.body.description,
    };

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update category',
        category,
        errors: errors.array(),
      });
      return;
    }
    const updated = await categoryQueries.updateCategory(
      req.params.id,
      category.name,
      category.description
    );
    notFoundHandler(updated, 'Error while updating category');
    res.redirect(`/category/${updated.id}`);
  }),
];
