const Router = require('express').Router;
const router = Router();
const departmentController = require('../controllers/departmentController');

// Убираем префикс '/departments'
router.post('/', departmentController.create);
router.get('/', departmentController.findAll);
router.get('/:id', departmentController.findOne);
router.put('/:id', departmentController.update);
router.delete('/:id', departmentController.delete);
router.get('/:id/exists', departmentController.exists);

module.exports = router;
