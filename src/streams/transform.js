#!/usr/bin/env node
// src/streams/transform.js

const { Transform } = require('stream');

const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        // chunk – это Buffer или строка (в зависимости от настройки encoding)
        const upperChunk = chunk.toString().toUpperCase();
        // Передаём преобразованные данные дальше
        callback(null, upperChunk);
    }
});

// Читаем из stdin -> пропускаем через Transform -> пишем в stdout
process.stdin.pipe(upperCaseTransform).pipe(process.stdout);

console.log('Введите текст, который будет преобразован в ВЕРХНИЙ РЕГИСТР (завершите ввод Ctrl+D/Ctrl+Z):');
