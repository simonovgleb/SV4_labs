// routes/organizationRoutes.js

const Router = require('express').Router;
const router = Router();
const organizationController = require('../controllers/organizationController');
const authenticateToken = require('../middleware/authenticateToken');

// POST /organizations - Создание организации (только админ)
router.post('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания организаций' });
}, organizationController.create);

// GET /organizations - Получение списка организаций (админ и пользователь)
router.get('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра организаций' });
}, organizationController.findAll);

// GET /organizations/:id - Получение организации по ID (админ и пользователь)
router.get('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра организации' });
}, organizationController.findOne);

// PUT /organizations/:id - Обновление организации (только админ)
router.put('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для обновления организации' });
}, organizationController.update);

// DELETE /organizations/:id - Удаление организации (только админ)
router.delete('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для удаления организации' });
}, organizationController.delete);

// GET /organizations/:id/exists - Проверка существования организации (админ и пользователь)
router.get('/:id/exists', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для проверки организации' });
}, organizationController.exists);

module.exports = router;
