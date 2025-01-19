#!/usr/bin/env node
// src/wt/spawn.js

const { spawn } = require('child_process');
const path = require('path');

// Допустим, мы хотим запустить скрипт search.js, который сделает поиск
// Предположим, что search.js лежит в той же папке, и принимает ключевое слово
// Пример: node search.js "Ключевое слово"

const [searchKeyword] = process.argv.slice(2);

if (!searchKeyword) {
    console.error('Использование: node spawn.js <ключевое_слово_поиска>');
    process.exit(1);
}

// Пусть у нас есть отдельный файл search.js (см. пример ниже)
const searchScriptPath = path.join(__dirname, 'search.js');

// Спавним процесс
const child = spawn('node', [searchScriptPath, searchKeyword], {
    stdio: 'inherit' // чтобы сразу видеть вывод
});

// Если хотим более тонко обрабатывать вывод, можно сделать так:
// const child = spawn('node', [searchScriptPath, searchKeyword]);

// child.stdout.on('data', (data) => {
//   console.log('Результат:', data.toString());
// });
// child.stderr.on('data', (data) => {
//   console.error('Ошибка процесса:', data.toString());
// });

child.on('close', (code) => {
    console.log(`Процесс поиска завершился с кодом: ${code}`);
});
