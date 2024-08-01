const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/categoryController');

router.get('/', category_controller.getAllCategories);

// router.get('/category', category_controller.list);
router.get('/create', category_controller.getCreateCategory);
router.post('/create', category_controller.postCreateCategory);
router.post('/:id/delete', category_controller.postDeleteCategory);
router.get('/:id/update', category_controller.getUpdateCategory);
router.post('/:id/update', category_controller.postUpdateCategory);
router.get('/:id', category_controller.getCategory);

module.exports = router;
