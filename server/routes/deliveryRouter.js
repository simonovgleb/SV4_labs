const Router = require('express').Router;
const router = Router();
const deliveryController = require('../controllers/deliveryController');

// Убираем префикс '/deliveries'
router.post('/', deliveryController.create);
router.get('/', deliveryController.findAll);
router.get('/:contract_id', deliveryController.findOne);
router.put('/:contract_id', deliveryController.update);
router.delete('/:contract_id', deliveryController.delete);
router.get('/:contract_id/exists', deliveryController.exists);

module.exports = router;
