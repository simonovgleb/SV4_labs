const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Регистрация и вход
router.post('/registration', UserController.registration);
router.post('/login', UserController.login);

// Аутентификация
router.get('/auth', authenticateToken, UserController.auth);

// Маршруты для пользователя
router.get('/', authenticateToken, UserController.findAll);
router.get('/:id', authenticateToken, UserController.findOne);
router.put('/:id', authenticateToken, UserController.update);
router.delete('/:id', authenticateToken, UserController.delete);

// Новые маршруты для смены и восстановления пароля
router.post('/:id/change-password', authenticateToken, UserController.changePassword);
router.post('/request-password-reset', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);

module.exports = router;
