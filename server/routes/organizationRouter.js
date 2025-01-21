const Router = require('express').Router;
const router = Router();
const organizationController = require('../controllers/organizationController');

// Убираем префикс '/organizations'
router.post('/', organizationController.create);
router.get('/', organizationController.findAll);
router.get('/:id', organizationController.findOne);
router.put('/:id', organizationController.update);
router.delete('/:id', organizationController.delete);
router.get('/:id/exists', organizationController.exists);

module.exports = router;
