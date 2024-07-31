const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');

exports.list = asyncHandler(async (req, res, next) => {
  // const items = await Item.find({}, 'name description category')
  //   .sort({ name: 1 })
  //   .populate('category')
  //   .exec();
  res.render('item_list', {
    title: 'Item list',
    items: [],
  });
});

exports.detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .sort({ name: 1 })
    .populate('category')
    .exec();
  res.render('item_detail', { title: item.name, item: item });
});

exports.create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render('item_form', { title: 'Create item', categories });
});

const formValidator = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .matches(/^[\w\s]+$/)
    .withMessage('Name can only contain alphabet or space'),
  body('description').trim().escape(),
  body('category')
    .isLength({ min: 1 })
    .escape()
    .withMessage('Category is required'),
  body('price')
    .optional({ values: 'falsy' })
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Price must be in number.'),
  body('instock')
    .optional({ values: 'falsy' })
    .trim()
    .escape()
    .isNumeric()
    .withMessage('Instock must be in number.'),
  body('image').optional({ value: 'falsy' }).trim().escape(),
];
exports.create_post = [
  formValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await Category.find().sort({ name: 1 }).exec();
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instock: req.body.instock,
      image_url: req.body.image_url,
    });
    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'Create item',
        item,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];
exports.delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/item');
});
exports.update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).sort({ name: 1 }).populate('category').exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);
  res.render('item_form', { title: 'Update item', item, categories });
});
exports.update_post = [
  formValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await Category.find().sort({ name: 1 }).exec();

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instock: req.body.instock,
      image_url: req.body.image_url,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'Update item',
        item,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updated = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updated.url);
    }
  }),
];
