const Router = require('express').Router;
const router = Router();
const departmentController = require('../controllers/departmentController');

router.post('/departments', departmentController.create);
router.get('/departments', departmentController.findAll);
router.get('/departments/:id', departmentController.findOne);
router.put('/departments/:id', departmentController.update);
router.delete('/departments/:id', departmentController.delete);
router.get('/departments/:id/exists', departmentController.exists);

module.exports = router;