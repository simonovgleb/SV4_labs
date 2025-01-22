// index.js
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

// Импорт маршрутов
import employeeRoutes from './routes/employeeRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

mongoose
    .connect('mongodb+srv://admin:He12345678@cluster0.vgtv5yo.mongodb.net/Sape?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express();

// Настройка хранения для multer
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Middleware
app.use(express.json()); // Для парсинга JSON-тел запросов
app.use(cors()); // Для разрешения CORS
app.use('/uploads', express.static('uploads')); // Для обслуживания статических файлов

// Маршрут для загрузки файлов
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// Подключение маршрутов API
app.use('/api/employees', employeeRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Обработка ошибок (опционально)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
const PORT = process.env.PORT || 4444;

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
