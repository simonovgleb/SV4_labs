#!/usr/bin/env node
// src/fs/read.js

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
    console.error('Использование: node read.js <ID записи>');
    process.exit(1);
}

try {
    ensureIndexFileExists();

    // Считываем индекс
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const indexArray = JSON.parse(indexContent);

    // Ищем запись по ID
    const recordEntry = indexArray.find(item => item.id === recordId);
    if (!recordEntry) {
        console.error(`Запись с ID "${recordId}" не найдена в индексе.`);
        process.exit(1);
    }

    // Читаем содержимое соответствующего файла
    const filePath = path.join(__dirname, recordEntry.filename);
    if (!fs.existsSync(filePath)) {
        console.error(`Файл с данными для ID "${recordId}" не найден: ${recordEntry.filename}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    console.log('Подробная информация об записи:');
    console.log(data);
} catch (error) {
    console.error('Ошибка при чтении записи:', error.message);
    process.exit(1);
}
