const Router = require('express').Router;
const router = Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/deliveries', deliveryController.create);
router.get('/deliveries', deliveryController.findAll);
router.get('/deliveries/:contract_id', deliveryController.findOne);
router.put('/deliveries/:contract_id', deliveryController.update);
router.delete('/deliveries/:contract_id', deliveryController.delete);
router.get('/deliveries/:contract_id/exists', deliveryController.exists);

module.exports = router;