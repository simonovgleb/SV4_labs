const Router = require('express').Router;
const router = Router();
const organizationController = require('../controllers/organizationController');

router.post('/organizations', organizationController.create);
router.get('/organizations', organizationController.findAll);
router.get('/organizations/:id', organizationController.findOne);
router.put('/organizations/:id', organizationController.update);
router.delete('/organizations/:id', organizationController.delete);
router.get('/organizations/:id/exists', organizationController.exists);

module.exports = router;