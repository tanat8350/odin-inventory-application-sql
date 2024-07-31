const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/categoryController');

router.get('/', category_controller.list);

// router.get('/category', category_controller.list);
router.get('/create', category_controller.create_get);
router.post('/create', category_controller.create_post);
router.get('/:id/delete', category_controller.delete_get);
router.post('/:id/delete', category_controller.delete_post);
router.get('/:id/update', category_controller.update_get);
router.post('/:id/update', category_controller.update_post);
router.get('/:id', category_controller.detail);

module.exports = router;
