// controllers/AdminController.js

const { Admin } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const resetTokens = {};

class AdminController {
    // Регистрация администратора
    async registration(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ message: 'Необходимы логин и пароль' });
            }

            const existingAdmin = await Admin.findOne({ where: { login } });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Администратор с таким логином уже существует' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const admin = await Admin.create({
                login,
                password: hashedPassword,
            });

            res.status(201).json({
                id: admin.id,
                login: admin.login,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при регистрации администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Вход администратора
    async login(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ message: 'Необходимы логин и пароль' });
            }

            const admin = await Admin.findOne({ where: { login } });
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { adminId: admin.id },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: admin.id,
                    login: admin.login,
                    role: 'admin', // Явно указываем роль
                },
            });
        } catch (error) {
            console.error('Ошибка при входе администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Аутентификация администратора
    async auth(req, res) {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            const admin = await Admin.findByPk(decoded.adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            res.json({
                user: {
                    id: admin.id,
                    login: admin.login,
                    role: 'admin',
                },
            });
        } catch (error) {
            console.error('Ошибка при аутентификации администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение администратора по ID
    async findOne(req, res) {
        try {
            const admin = await Admin.findByPk(req.params.id);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }
            res.json({
                id: admin.id,
                login: admin.login,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при получении администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение всех администраторов
    async findAll(req, res) {
        try {
            const admins = await Admin.findAll({
                attributes: ['id', 'login', 'createdAt', 'updatedAt'],
            });
            res.json(admins);
        } catch (error) {
            console.error('Ошибка при получении списка администраторов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление данных администратора
    async update(req, res) {
        try {
            const { login, password } = req.body;
            const adminId = req.params.id;

            // Проверка прав доступа (только сам админ может обновлять свой профиль)
            if (req.user.adminId !== parseInt(adminId, 10)) {
                return res.status(403).json({ message: 'Нет прав для обновления этого профиля' });
            }

            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            let updatedData = {};
            if (login) updatedData.login = login;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updatedData.password = hashedPassword;
            }

            await admin.update(updatedData);

            res.json({
                id: admin.id,
                login: admin.login,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при обновлении администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление администратора
    async delete(req, res) {
        try {
            const adminId = req.params.id;

            // Проверка прав доступа (только сам админ может удалить свой профиль)
            if (req.user.adminId !== parseInt(adminId, 10)) {
                return res.status(403).json({ message: 'Нет прав для удаления этого профиля' });
            }

            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            await admin.destroy();

            res.status(200).json({ message: 'Администратор успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Метод для смены пароля (только для аутентифицированного администратора)
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const adminId = req.user.adminId;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Необходимы текущий и новый пароли' });
            }

            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Текущий пароль неверен' });
            }

            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(newPassword, salt);
            await admin.save();

            res.json({ message: 'Пароль успешно изменён' });
        } catch (error) {
            console.error('Ошибка при смене пароля администратора:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Запрос на восстановление пароля
    async requestPasswordReset(req, res) {
        try {
            const { login } = req.body;
            if (!login) {
                return res.status(400).json({ message: 'Укажите логин' });
            }

            const admin = await Admin.findOne({ where: { login } });
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            // Сохраняем данные о токене в resetTokens
            resetTokens[token] = { adminId: admin.id, expires: Date.now() + 3600000 }; // токен действителен 1 час

            // В реальном приложении отправьте токен на email пользователя
            res.json({ message: 'Токен для восстановления пароля сгенерирован', token });
        } catch (error) {
            console.error('Ошибка при запросе восстановления пароля:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Сброс пароля по токену
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json({ message: 'Необходимы токен и новый пароль' });
            }

            const tokenData = resetTokens[token];
            if (!tokenData || tokenData.expires < Date.now()) {
                return res.status(400).json({ message: 'Неверный или просроченный токен' });
            }

            const admin = await Admin.findByPk(tokenData.adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Администратор не найден' });
            }

            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(newPassword, salt);
            await admin.save();

            // Удаляем использованный токен из памяти
            delete resetTokens[token];

            res.json({ message: 'Пароль успешно изменён' });
        } catch (error) {
            console.error('Ошибка при сбросе пароля:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new AdminController();