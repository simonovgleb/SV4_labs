const Router = require('express').Router;
const router = Router();
const contractController = require('../controllers/contractController');
const authenticateToken = require('../middleware/authenticateToken');

// Определяем маршруты относительно корневого пути
router.post('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.create);

router.get('/', authenticateToken, (req, res, next) => {
    if (req.user.role === 'user' || req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.findAll);

router.get('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'user' || req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.findOne);

router.put('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.update);

router.delete('/:id', authenticateToken, (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.delete);

router.get('/:id/exists', authenticateToken, (req, res, next) => {
    if (req.user.role === 'user' || req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Нет прав для создания записей' });
}, contractController.exists);

module.exports = router;
