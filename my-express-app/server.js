// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

// Для удобства чтения тела POST-запроса
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Подключаем body-parser, чтобы парсить JSON в теле запроса
app.use(bodyParser.json());
// Если нужно парсить данные из форм (application/x-www-form-urlencoded):
app.use(bodyParser.urlencoded({ extended: true }));

// === ПУТИ К JSON-ФАЙЛАМ ===
const variantsFilePath = path.join(__dirname, 'data', 'variants.json');
const statsFilePath = path.join(__dirname, 'data', 'stats.json');

// === МЕТОДЫ ДЛЯ ЧТЕНИЯ/ЗАПИСИ JSON ===
function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Ошибка чтения файла ${filePath}:`, error);
        return null;
    }
}

function writeJSONFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Ошибка записи файла ${filePath}:`, error);
        return false;
    }
}

// === 1. GET-сервис, возвращающий HTML-страницу (фронтенд) ===
// Вариант 1: напрямую отдаём файл index.html
app.get('/page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// (Необязательно) Вариант 2: раздавать статику из папки public, чтобы подключались
// стили, скрипты и т.д.
// app.use(express.static(path.join(__dirname, 'public')));

// === 2. GET-сервис, который возвращает какие-то данные в формате JSON ===
// Допустим, это список вариантов голосования
app.get('/variants', (req, res) => {
    const variants = readJSONFile(variantsFilePath);
    if (!variants) {
        return res.status(500).json({ error: 'Не удалось прочитать варианты' });
    }
    res.json(variants);
});

// === 3. POST-сервис, который возвращает какие-то данные в формате JSON ===
// Пусть он возвращает статистику голосования
app.post('/stat', (req, res) => {
    const stats = readJSONFile(statsFilePath);
    if (!stats) {
        return res.status(500).json({ error: 'Не удалось прочитать статистику' });
    }
    res.json(stats);
});

// === 4. POST-сервис, который принимает какие-то данные ===
// Допустим, пользователь отправляет свой голос (vote)
app.post('/vote', (req, res) => {
    const { variantId } = req.body;

    // Обрабатываем "исключительную ситуацию" - если не выбран вариант
    if (!variantId) {
        return res.status(400).json({ error: 'Вариант голосования не выбран' });
    }

    // Читаем статистику из файла
    const stats = readJSONFile(statsFilePath);
    if (!stats) {
        return res.status(500).json({ error: 'Ошибка чтения файла статистики' });
    }

    // Ищем соответствующий вариант в stats по id
    const statItem = stats.find(item => item.id === Number(variantId));
    if (!statItem) {
        return res.status(400).json({ error: 'Неверный вариант голосования' });
    }

    // Увеличиваем количество голосов
    statItem.votes += 1;

    // Записываем обратно в файл
    const success = writeJSONFile(statsFilePath, stats);
    if (!success) {
        return res.status(500).json({ error: 'Ошибка записи в файл статистики' });
    }

    // Возвращаем обновлённую статистику
    res.json({ message: 'Голос учтён', stats });
});

// === 5. DELETE-сервис для отмены или удаления каких-то данных ===
// Например, отмена результата последнего голосования.
// В простом случае считаем, что "последний голос" - это последний элемент в файле stats
// или запоминаем отдельным образом историю. Тут сделаем упрощённый вариант:
// уменьшим количество голосов у последнего проголосовавшего варианта
app.delete('/cancel', (req, res) => {
    // Здесь можно хранить в памяти или в отдельном файле "историю" последних голосов,
    // но для примера – просто уменьшим число голосов у варианта с максимальным счётчиком
    const stats = readJSONFile(statsFilePath);
    if (!stats) {
        return res.status(500).json({ error: 'Ошибка чтения файла статистики' });
    }

    // Находим вариант с максимальным количеством голосов
    let maxVotes = -1;
    let maxIndex = -1;
    stats.forEach((item, index) => {
        if (item.votes > maxVotes) {
            maxVotes = item.votes;
            maxIndex = index;
        }
    });

    if (maxIndex === -1 || maxVotes === 0) {
        return res.status(400).json({ error: 'Нет голосов для отмены' });
    }

    // Уменьшаем на 1
    stats[maxIndex].votes -= 1;

    const success = writeJSONFile(statsFilePath, stats);
    if (!success) {
        return res.status(500).json({ error: 'Ошибка записи в файл статистики' });
    }

    res.json({ message: 'Отмена последнего голоса выполнена', stats });
});

// === 6. Сервис для получения данных в формате XML/HTML/JSON
// Например, /download, который возвращает статистику голосования
// в зависимости от заголовка Accept
app.get('/download', (req, res) => {
    const stats = readJSONFile(statsFilePath);
    if (!stats) {
        return res.status(500).json({ error: 'Ошибка чтения файла статистики' });
    }

    const acceptHeader = req.headers.accept || '';

    if (acceptHeader.includes('application/xml')) {
        // Возвращаем XML
        res.type('application/xml');
        // Сформируем простой XML
        let xmlData = '<?xml version="1.0" encoding="UTF-8"?><stats>';
        stats.forEach(item => {
            xmlData += `<variant><id>${item.id}</id><votes>${item.votes}</votes></variant>`;
        });
        xmlData += '</stats>';
        res.send(xmlData);
    } else if (acceptHeader.includes('text/html')) {
        // Возвращаем HTML
        res.type('text/html');
        let htmlData = '<html><head><meta charset="UTF-8"><title>Статистика</title></head><body>';
        htmlData += '<h1>Статистика голосования</h1><ul>';
        stats.forEach(item => {
            htmlData += `<li>Вариант #${item.id}: ${item.votes} голосов</li>`;
        });
        htmlData += '</ul></body></html>';
        res.send(htmlData);
    } else {
        // По умолчанию JSON
        res.json(stats);
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
