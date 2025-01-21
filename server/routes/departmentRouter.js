// routes/departmentRoutes.js

const Router = require('express').Router;
const router = Router();
const departmentController = require('../controllers/departmentController');
const authenticateToken = require('../middleware/authenticateToken');

// POST /departments - Создание отдела (только админ)
router.post('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания отделов' });
}, departmentController.create);

// GET /departments - Получение списка отделов (админ и пользователь)
router.get('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра отделов' });
}, departmentController.findAll);

// GET /departments/:id - Получение отдела по ID (админ и пользователь)
router.get('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра отдела' });
}, departmentController.findOne);

// PUT /departments/:id - Обновление отдела (только админ)
router.put('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для обновления отдела' });
}, departmentController.update);

// DELETE /departments/:id - Удаление отдела (только админ)
router.delete('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для удаления отдела' });
}, departmentController.delete);

// GET /departments/:id/exists - Проверка существования отдела (админ и пользователь)
router.get('/:id/exists', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для проверки отдела' });
}, departmentController.exists);

module.exports = router;
