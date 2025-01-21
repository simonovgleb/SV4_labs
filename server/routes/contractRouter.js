const Router = require('express').Router;
const router = Router();
const contractController = require('../controllers/contractController');

router.post('/contracts', contractController.create);
router.get('/contracts', contractController.findAll);
router.get('/contracts/:id', contractController.findOne);
router.put('/contracts/:id', contractController.update);
router.delete('/contracts/:id', contractController.delete);
router.get('/contracts/:id/exists', contractController.exists);

module.exports = router;