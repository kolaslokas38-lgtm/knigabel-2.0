#!/usr/bin/env node

/**
 * Скрипт проверки готовности проекта к развертыванию
 * Запускается командой: node check-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка готовности проекта КнігаБел к развертыванию...\n');

const checks = [
    {
        name: '📁 Структура файлов',
        check: () => {
            const requiredFiles = [
                'index.html',
                'style.css',
                'manifest.json',
                'server/server.js',
                'package.json',
                'vercel.json'
            ];

            const missing = requiredFiles.filter(file => !fs.existsSync(file));
            if (missing.length > 0) {
                throw new Error(`Отсутствуют файлы: ${missing.join(', ')}`);
            }
            return '✅ Все необходимые файлы присутствуют';
        }
    },
    {
        name: '📦 Зависимости',
        check: () => {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const serverPackageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

            if (!packageJson.dependencies || !serverPackageJson.dependencies) {
                throw new Error('Не найдены зависимости в package.json');
            }
            return '✅ Зависимости настроены корректно';
        }
    },
    {
        name: '🌐 Manifest.json',
        check: () => {
            const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
            const required = ['name', 'short_name', 'start_url', 'display'];

            const missing = required.filter(key => !manifest[key]);
            if (missing.length > 0) {
                throw new Error(`Отсутствуют поля: ${missing.join(', ')}`);
            }
            return '✅ Manifest настроен для PWA';
        }
    },
    {
        name: '🤖 Telegram Mini App',
        check: () => {
            const html = fs.readFileSync('index.html', 'utf8');
            const hasTelegramScript = html.includes('telegram.org/js/telegram-web-app.js');
            const hasManifest = html.includes('manifest.json');

            if (!hasTelegramScript) {
                throw new Error('Не найден Telegram Web App скрипт');
            }
            if (!hasManifest) {
                throw new Error('Не подключен manifest.json');
            }
            return '✅ Telegram Mini App интеграция готова';
        }
    },
    {
        name: '🚀 Vercel конфигурация',
        check: () => {
            const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
            if (!vercel.routes || !vercel.headers) {
                throw new Error('Некорректная конфигурация Vercel');
            }
            return '✅ Vercel настроен для развертывания';
        }
    },
    {
        name: '📚 Данные книг',
        check: () => {
            const booksData = require('./server/books-data');
            if (!booksData.books || booksData.books.length === 0) {
                throw new Error('Нет данных книг');
            }
            return `✅ Загружено ${booksData.books.length} книг`;
        }
    }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
    try {
        const result = check();
        console.log(`${name}: ${result}`);
    } catch (error) {
        console.log(`${name}: ❌ ${error.message}`);
        allPassed = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 ПРОЕКТ ГОТОВ К РАЗВЕРТЫВАНИЮ!');
    console.log('\n📋 Следующие шаги:');
    console.log('1. npm run deploy (развертывание на Vercel)');
    console.log('2. Настройка Telegram бота (см. TELEGRAM_SETUP.md)');
    console.log('3. Тестирование через test-mini-app.html');
    console.log('\n🔗 После развертывания поделитесь ссылкой с преподавателем!');
} else {
    console.log('⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ!');
    console.log('Исправьте ошибки перед развертыванием.');
    process.exit(1);
}

console.log('\n📖 Документация:');
console.log('- README.md - общая информация');
console.log('- TELEGRAM_SETUP.md - настройка Mini App');
console.log('- test-mini-app.html - тестирование');

console.log('\n💡 Поддержка: Создайте issue на GitHub при проблемах');