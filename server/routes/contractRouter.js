const Router = require('express').Router;
const router = Router();
const contractController = require('../controllers/contractController');

// Определяем маршруты относительно корневого пути
router.post('/', contractController.create);
router.get('/', contractController.findAll);
router.get('/:id', contractController.findOne);
router.put('/:id', contractController.update);
router.delete('/:id', contractController.delete);
router.get('/:id/exists', contractController.exists);

module.exports = router;
