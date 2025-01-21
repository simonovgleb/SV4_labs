// routes/employeeRoutes.js

const Router = require('express').Router;
const router = Router();
const employeeController = require('../controllers/employeeController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload'); // Middleware для обработки файлов

// POST /employees - Создание сотрудника (только админ)
router.post('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания сотрудников' });
}, upload.single('photo'), employeeController.create);

// GET /employees - Получение списка сотрудников (админ и пользователь)
router.get('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра сотрудников' });
}, employeeController.findAll);

// GET /employees/:id - Получение сотрудника по ID (админ и пользователь)
router.get('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра сотрудника' });
}, employeeController.findOne);

// PUT /employees/:id - Обновление сотрудника (только админ)
router.put('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для обновления сотрудника' });
}, upload.single('photo'), employeeController.update);

// DELETE /employees/:id - Удаление сотрудника (только админ)
router.delete('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для удаления сотрудника' });
}, employeeController.delete);

// GET /employees/:id/exists - Проверка существования сотрудника (админ и пользователь)
router.get('/:id/exists', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для проверки сотрудника' });
}, employeeController.exists);

module.exports = router;
