const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.get('/create', itemController.getCreateItem);
router.post('/create', itemController.postCreateItem);
router.post('/:id/delete', itemController.postDeleteItem);
router.get('/:id/update', itemController.getUpdateItem);
router.post('/:id/update', itemController.postUpdateItem);
router.get('/:id', itemController.getItem);

module.exports = router;
