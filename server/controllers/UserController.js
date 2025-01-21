// controllers/UserController.js

const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    // Регистрация пользователя
    async registration(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ message: 'Необходимы логин и пароль' });
            }

            const existingUser = await User.findOne({ where: { login } });
            if (existingUser) {
                return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                login,
                password: hashedPassword,
            });

            res.status(201).json({
                id: user.id,
                login: user.login,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при регистрации пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Вход пользователя
    async login(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({ message: 'Необходимы логин и пароль' });
            }

            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    role: 'user', // Явно указываем роль
                },
            });
        } catch (error) {
            console.error('Ошибка при входе пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Аутентификация пользователя
    async auth(req, res) {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.json({
                user: {
                    id: user.id,
                    login: user.login,
                    role: 'user',
                },
            });
        } catch (error) {
            console.error('Ошибка при аутентификации пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение пользователя по ID
    async findOne(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            res.json({
                id: user.id,
                login: user.login,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение всех пользователей
    async findAll(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'login', 'createdAt', 'updatedAt'],
            });
            res.json(users);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление данных пользователя
    async update(req, res) {
        try {
            const { login, password } = req.body;
            const userId = req.params.id;

            // Проверка прав доступа (только сам пользователь может обновлять свой профиль)
            if (req.user.userId !== parseInt(userId, 10)) {
                return res.status(403).json({ message: 'Нет прав для обновления этого профиля' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            let updatedData = {};
            if (login) updatedData.login = login;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updatedData.password = hashedPassword;
            }

            await user.update(updatedData);

            res.json({
                id: user.id,
                login: user.login,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление пользователя
    async delete(req, res) {
        try {
            const userId = req.params.id;

            // Проверка прав доступа (только сам пользователь может удалить свой профиль)
            if (req.user.userId !== parseInt(userId, 10)) {
                return res.status(403).json({ message: 'Нет прав для удаления этого профиля' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            await user.destroy();

            res.status(200).json({ message: 'Пользователь успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Метод для смены пароля (только для аутентифицированного пользователя)
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.userId;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Необходимы текущий и новый пароли' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Текущий пароль неверен' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.json({ message: 'Пароль успешно изменён' });
        } catch (error) {
            console.error('Ошибка при смене пароля пользователя:', error);
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

            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            resetTokens[token] = { userId: user.id, expires: Date.now() + 3600000 }; // токен действителен 1 час

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

            const user = await User.findByPk(tokenData.userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            delete resetTokens[token];

            res.json({ message: 'Пароль успешно изменён' });
        } catch (error) {
            console.error('Ошибка при сбросе пароля:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new UserController();