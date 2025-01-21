// routes/deliveryRoutes.js

const Router = require('express').Router;
const router = Router();
const deliveryController = require('../controllers/deliveryController');
const authenticateToken = require('../middleware/authenticateToken');

// POST /deliveries - Создание поставки (только админ)
router.post('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания поставок' });
}, deliveryController.create);

// GET /deliveries - Получение списка поставок (админ и пользователь)
router.get('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра поставок' });
}, deliveryController.findAll);

// GET /deliveries/:contract_id - Получение поставки по contract_id (админ и пользователь)
router.get('/:contract_id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для просмотра поставки' });
}, deliveryController.findOne);

// PUT /deliveries/:contract_id - Обновление поставки (только админ)
router.put('/:contract_id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для обновления поставки' });
}, deliveryController.update);

// DELETE /deliveries/:contract_id - Удаление поставки (только админ)
router.delete('/:contract_id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для удаления поставки' });
}, deliveryController.delete);

// GET /deliveries/:contract_id/exists - Проверка существования поставки (админ и пользователь)
router.get('/:contract_id/exists', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для проверки поставки' });
}, deliveryController.exists);

module.exports = router;