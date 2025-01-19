#!/usr/bin/env node
// src/streams/write.js

const fs = require('fs');
const path = require('path');

const [filePathArg] = process.argv.slice(2);

if (!filePathArg) {
    console.error('Использование: node write.js <путь_к_выходному_файлу>');
    process.exit(1);
}

const filePath = path.resolve(filePathArg);

// Создаём поток записи
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

console.log('Введите текст для записи в файл (завершите ввод Ctrl+D/Ctrl+Z):');

// Читаем из stdin и пишем в файл
process.stdin.pipe(writeStream);

writeStream.on('finish', () => {
    console.log(`Данные успешно записаны в файл "${filePath}".`);
});

writeStream.on('error', err => {
    console.error('Ошибка записи в файл:', err.message);
});

// Когда поток stdin завершён (Ctrl+D / Ctrl+Z), поток записи закрывается
process.stdin.on('end', () => {
    writeStream.end();
});
