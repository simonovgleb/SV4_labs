#!/usr/bin/env node
// src/wt/search.js

const fs = require('fs');
const path = require('path');

const [searchKeyword] = process.argv.slice(2);

if (!searchKeyword) {
    console.error('Использование: node search.js <ключевое_слово_поиска>');
    process.exit(1);
}

// Файл индекса
const INDEX_FILE = path.join(__dirname, '..', 'fs', 'book_index.json');

try {
    if (!fs.existsSync(INDEX_FILE)) {
        console.error('Индексный файл не найден. Нет книг для поиска.');
        process.exit(1);
    }

    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const indexArray = JSON.parse(indexContent);

    // Ищем записи, у которых title или author содержит searchKeyword (простейший пример)
    const results = indexArray.filter(entry => {
        const { title, author } = entry;
        return (
            title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            author.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    });

    if (results.length === 0) {
        console.log(`Ничего не найдено по запросу "${searchKeyword}".`);
        process.exit(0);
    }

    console.log(`Результаты поиска по ключевому слову "${searchKeyword}":`);
    results.forEach(r => {
        console.log(`- [ID: ${r.id}] "${r.title}" от ${r.author} (файл: ${r.filename})`);
    });

    process.exit(0);
} catch (error) {
    console.error('Ошибка при поиске:', error.message);
    process.exit(1);
}
