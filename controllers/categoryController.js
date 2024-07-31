const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

const notFoundHandler = (data) => {
  if (data === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }
};

exports.list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('category_list', { title: 'Categories', items: allCategories });
});

exports.detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).sort({ name: 1 }).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  notFoundHandler(category);

  res.render('category_detail', {
    title: category.name,
    category,
    items,
  });
});
exports.create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create category' });
});
const validateForm = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('description').trim(),
];
exports.create_post = [
  validateForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];
exports.delete_get = asyncHandler(async (req, res, next) => {
  res.send('delete_get');
});
exports.delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/category');
});
exports.update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .sort({ name: 1 })
    .exec();

  notFoundHandler(category);

  res.render('category_form', { title: 'Update category', category });
});
exports.update_post = [
  validateForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      const updated = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updated.url);
    }
  }),
];
