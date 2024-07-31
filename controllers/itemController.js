const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const itemQueries = require('../db/itemQueries');
const categoryQueries = require('../db/categoryQueries');

exports.getAllItems = asyncHandler(async (req, res, next) => {
  const items = await itemQueries.getAllItems();
  res.render('item_list', {
    title: 'Item list',
    items,
  });
});

exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await itemQueries.getItem(req.params.id);
  if (!item) {
    return next({ status: 404, message: 'Message not found' });
  }
  res.render('item_detail', { title: item.name, item });
});

exports.getCreateItem = asyncHandler(async (req, res, next) => {
  const categories = await categoryQueries.getAllCategories();
  res.render('item_form', { title: 'Create item', categories });
});

const formValidator = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must be specified.')
    .matches(/^[\w\s]+$/)
    .withMessage('Name can only contain alphabet or space'),
  body('description').trim().escape(),
  body('category').isLength({ min: 1 }).withMessage('Category is required'),
  body('price')
    .optional({ values: 'falsy' })
    .trim()
    .isNumeric()
    .withMessage('Price must be in number.'),
  body('instock')
    .optional({ values: 'falsy' })
    .trim()
    .isNumeric()
    .withMessage('Instock must be in number.'),
  body('image').optional({ value: 'falsy' }).trim().escape(),
];

exports.postCreateItem = [
  formValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = {
      name: req.body.name,
      description: req.body.description,
      category: +req.body.category,
      price: +req.body.price,
      instock: +req.body.instock,
      image_url: req.body.image_url,
    };
    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'Create item',
        item,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      const created = await itemQueries.createItem(
        item.name,
        item.description,
        item.category,
        item.price,
        item.instock,
        item.image_url
      );
      if (!created) {
        return next({ status: 500, message: 'Create item failed' });
      }
      res.redirect(`/item/${created.id}`);
    }
  }),
];

exports.postDeleteItem = asyncHandler(async (req, res, next) => {
  const deleted = await itemQueries.deleteItem(req.params.id);
  if (!deleted) {
    return next({ status: 500, message: 'Delete item failed' });
  }
  res.redirect('/item');
});

exports.getUpdateItem = asyncHandler(async (req, res, next) => {
  const item = await itemQueries.getItem(req.params.id);
  const categories = await categoryQueries.getAllCategories();
  res.render('item_form', { title: 'Update item', item, categories });
});

exports.postUpdateItem = [
  formValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = {
      name: req.body.name,
      description: req.body.description,
      categoryid: +req.body.category,
      price: +req.body.price,
      instock: +req.body.instock,
      image_url: req.body.image_url,
    };
    if (!errors.isEmpty()) {
      const categories = await categoryQueries.getAllCategories();
      res.render('item_form', {
        title: 'Update item',
        item,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updated = await itemQueries.updateItem(
        req.params.id,
        item.name,
        item.description,
        item.category,
        item.price,
        item.instock,
        item.image_url
      );
      res.redirect(`/item/${req.params.id}`);
    }
  }),
];
