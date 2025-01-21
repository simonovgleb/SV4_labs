const express = require('express');
const AdminController = require('../controllers/AdminController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Регистрация и вход
router.post('/registration', AdminController.registration);
router.post('/login', AdminController.login);

// Аутентификация
router.get('/auth', authenticateToken, AdminController.auth);

// Маршруты для администратора
router.get('/', authenticateToken, AdminController.findAll);
router.get('/:id', authenticateToken, AdminController.findOne);
router.put('/:id', authenticateToken, AdminController.update);
router.delete('/:id', authenticateToken, AdminController.delete);

// Новые маршруты для смены и восстановления пароля
router.post('/:id/change-password', authenticateToken, AdminController.changePassword);
router.post('/request-password-reset', AdminController.requestPasswordReset);
router.post('/reset-password', AdminController.resetPassword);

module.exports = router;
