#!/usr/bin/env node
// src/fs/list.js

const fs = require('fs');
const path = require('path');

const INDEX_FILE = path.join(__dirname, 'book_index.json');

function ensureIndexFileExists() {
    if (!fs.existsSync(INDEX_FILE)) {
        fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2), 'utf8');
    }
}

// Не ожидаем аргументов
try {
    ensureIndexFileExists();
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const indexArray = JSON.parse(indexContent);

    if (indexArray.length === 0) {
        console.log('Нет ни одной записи.');
    } else {
        console.log('Список всех записей:');
        indexArray.forEach(entry => {
            console.log(`- ID: ${entry.id}, Title: ${entry.title}, Author: ${entry.author}, File: ${entry.filename}`);
        });
    }
} catch (error) {
    console.error('Ошибка при чтении списка записей:', error.message);
    process.exit(1);
}
