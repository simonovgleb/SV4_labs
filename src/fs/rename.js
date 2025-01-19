#!/usr/bin/env node
// src/fs/rename.js

const fs = require('fs');
const path = require('path');

const [oldName, newName] = process.argv.slice(2);

if (!oldName || !newName) {
    console.error('Использование: node rename.js <старое_название> <новое_название>');
    process.exit(1);
}

const oldPath = path.join(__dirname, oldName);
const newPath = path.join(__dirname, newName);

if (!fs.existsSync(oldPath)) {
    console.error(`Файл/папка "${oldName}" не существует.`);
    process.exit(1);
}

if (fs.existsSync(newPath)) {
    console.error(`Файл/папка с именем "${newName}" уже существует. Выберите другое имя.`);
    process.exit(1);
}

try {
    fs.renameSync(oldPath, newPath);
    console.log(`"${oldName}" переименован(а) в "${newName}".`);
} catch (error) {
    console.error('Ошибка переименования:', error.message);
    process.exit(1);
}
