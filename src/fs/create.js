#!/usr/bin/env node
// src/fs/create.js

const fs = require('fs');
const path = require('path');

// Путь к индексу всех записей
const INDEX_FILE = path.join(__dirname, 'book_index.json');

function ensureIndexFileExists() {
    // Проверяем, существует ли файл INDEX_FILE; если нет - создаём пустой
    if (!fs.existsSync(INDEX_FILE)) {
        fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2), 'utf8');
    }
}

function createRecord(title, author, isbn, year) {
    // Генерируем уникальный ID (можно использовать timestamp + random, или только timestamp)
    const id = Date.now().toString();

    // Формируем имя файла для новой книги
    const filename = `book_${id}.json`;
    const filepath = path.join(__dirname, filename);

    // Проверяем, нет ли уже такого файла
    if (fs.existsSync(filepath)) {
        throw new Error('Ошибка операции FS: Запись уже существует');
    }

    // Создаём объект с подробной информацией
    const recordData = {
        id,
        title,
        author,
        isbn,
        year
    };

    // Записываем в JSON-файл
    fs.writeFileSync(filepath, JSON.stringify(recordData, null, 2), 'utf8');

    // Теперь обновим индексный файл
    ensureIndexFileExists();

    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const indexArray = JSON.parse(indexContent);

    const newIndexEntry = {
        id,
        title,
        author,
        filename
    };

    indexArray.push(newIndexEntry);

    // Сохраняем индексный файл
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexArray, null, 2), 'utf8');

    console.log(`Новая запись создана. ID: ${id}, файл: ${filename}`);
}

// Запуск скрипта
// Ожидаем 4 аргумента: [название, автор, isbn, год]
const [title, author, isbn, year] = process.argv.slice(2);

if (!title || !author || !isbn || !year) {
    console.error('Использование: node create.js "Название" "Автор" "ISBN" "Год"');
    process.exit(1);
}

try {
    createRecord(title, author, isbn, year);
} catch (err) {
    console.error('Ошибка при создании записи:', err.message);
    process.exit(1);
}
