#!/usr/bin/env node
// src/fs/delete.js

const fs = require('fs');
const path = require('path');

const INDEX_FILE = path.join(__dirname, 'book_index.json');

function ensureIndexFileExists() {
    if (!fs.existsSync(INDEX_FILE)) {
        fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2), 'utf8');
    }
}

const [recordId] = process.argv.slice(2);

if (!recordId) {
    console.error('Использование: node delete.js <ID записи>');
    process.exit(1);
}

try {
    ensureIndexFileExists();

    // Считываем индекс
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const indexArray = JSON.parse(indexContent);

    // Ищем запись по ID
    const recordIndex = indexArray.findIndex(item => item.id === recordId);
    if (recordIndex === -1) {
        console.error(`Запись с ID "${recordId}" не найдена в индексе.`);
        process.exit(1);
    }

    const record = indexArray[recordIndex];
    const filepath = path.join(__dirname, record.filename);

    // Удаляем файл, если он существует
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`Файл "${record.filename}" удалён.`);
    } else {
        console.log(`Файл "${record.filename}" не найден (возможно, уже удалён).`);
    }

    // Удаляем запись из индексного массива
    indexArray.splice(recordIndex, 1);

    // Сохраняем обновлённый индекс
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexArray, null, 2), 'utf8');
    console.log(`Запись с ID "${recordId}" удалена из индекса.`);
} catch (error) {
    console.error('Ошибка при удалении записи:', error.message);
    process.exit(1);
}
