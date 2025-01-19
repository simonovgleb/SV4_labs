#!/usr/bin/env node
// src/streams/read.js

const fs = require('fs');
const path = require('path');

const [filePathArg] = process.argv.slice(2);

if (!filePathArg) {
    console.error('Использование: node read.js <путь_к_большому_файлу>');
    process.exit(1);
}

const filePath = path.resolve(filePathArg);

// Проверяем, существует ли файл
if (!fs.existsSync(filePath)) {
    console.error(`Файл "${filePath}" не существует.`);
    process.exit(1);
}

// Создаём поток чтения
const readStream = fs.createReadStream(filePath, {
    encoding: 'utf8',
    highWaterMark: 1024 // размер буфера (1KB для примера)
});

// Подписываемся на события
readStream.on('data', chunk => {
    console.log('Чтение очередного куска данных:');
    console.log(chunk);
});

readStream.on('end', () => {
    console.log('Чтение файла завершено.');
});

readStream.on('error', err => {
    console.error('Ошибка чтения файла:', err.message);
});
