// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов (пример)
import translationEn from './locales/en/translation.json';
import translationRu from './locales/ru/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationEn,
            },
            ru: {
                translation: translationRu,
            },
        },
        lng: 'ru', // язык по умолчанию
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react уже экранирует
        },
    });

export default i18n;
