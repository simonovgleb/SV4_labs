import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="btn-group" role="group" aria-label="Language switcher">
            <button
                type="button"
                className={`btn btn-outline-primary ${i18n.language === 'en' ? 'active' : ''
                    }`}
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <button
                type="button"
                className={`btn btn-outline-primary ${i18n.language === 'ru' ? 'active' : ''
                    }`}
                onClick={() => changeLanguage('ru')}
            >
                RU
            </button>
        </div>
    );
}
