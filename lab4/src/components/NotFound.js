// src/components/NotFound.js
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="container text-center mt-5">
            <h2 className="display-4 text-danger">{t('common.notFound')}</h2>
            <p className="lead">{t('common.pageNotFound')}</p>
            <a href="/" className="btn btn-primary mt-3">
                {t('common.goHome')}
            </a>
        </div>
    );
}
