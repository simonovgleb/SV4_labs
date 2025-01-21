const Router = require('express').Router;
const router = Router();
const employeeController = require('../controllers/employeeController');
const upload = require('../middleware/upload'); // Middleware для обработки файлов

router.post('/', upload.single('photo'), employeeController.create);
router.get('/', employeeController.findAll);
router.get('/:id', employeeController.findOne);
router.put('/:id', upload.single('photo'), employeeController.update);
router.delete('/:id', employeeController.delete);
router.get('/:id/exists', employeeController.exists);

module.exports = router;
