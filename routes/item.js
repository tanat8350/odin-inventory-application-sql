const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');

router.get('/', item_controller.list);
router.get('/create', item_controller.create_get);
router.post('/create', item_controller.create_post);
router.post('/:id/delete', item_controller.delete_post);
router.get('/:id/update', item_controller.update_get);
router.post('/:id/update', item_controller.update_post);
router.get('/:id', item_controller.detail);

module.exports = router;
