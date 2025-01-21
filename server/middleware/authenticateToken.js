// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Не авторизован' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен' });
        }

        // Определение роли пользователя и соответствующих ID
        if (decoded.adminId) {
            req.user = { role: 'admin', adminId: decoded.adminId };
        } else if (decoded.userId) {
            req.user = { role: 'user', userId: decoded.userId };
        } else {
            return res.status(403).json({ message: 'Недействительный токен' });
        }

        next();
    });
}

module.exports = authenticateToken;
