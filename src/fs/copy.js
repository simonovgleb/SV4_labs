#!/usr/bin/env node
// src/fs/copy.js

const fs = require('fs');
const path = require('path');

function copyFolderSync(src, dest) {
    // Проверяем, существует ли исходная папка
    if (!fs.existsSync(src)) {
        throw new Error(`Исходная папка не найдена: ${src}`);
    }

    // Создаём целевую папку, если она не существует
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Получаем список файлов и папок
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Рекурсивно копируем папку
            copyFolderSync(srcPath, destPath);
        } else {
            // Копируем файл
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const [srcFolder, destFolder] = process.argv.slice(2);

if (!srcFolder || !destFolder) {
    console.error('Использование: node copy.js <путь_к_исходной_папке> <путь_к_целевой_папке>');
    process.exit(1);
}

try {
    copyFolderSync(srcFolder, destFolder);
    console.log(`Копирование из "${srcFolder}" в "${destFolder}" завершено успешно.`);
} catch (error) {
    console.error('Ошибка копирования:', error.message);
    process.exit(1);
}
