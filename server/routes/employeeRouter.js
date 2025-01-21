const Router = require('express').Router;
const router = Router();
const employeeController = require('../controllers/employeeController');

router.post('/employees', employeeController.create);
router.get('/employees', employeeController.findAll);
router.get('/employees/:id', employeeController.findOne);
router.put('/employees/:id', employeeController.update);
router.delete('/employees/:id', employeeController.delete);
router.get('/employees/:id/exists', employeeController.exists);

module.exports = router;