// src/components/TodoFilter.js
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TodoFilter({ value, onChange }) {
    const { t } = useTranslation();

    const handleFilterChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="mb-3">
            <label htmlFor="todoFilter" className="form-label">
                {t('Фильтр')}:
            </label>
            <input
                id="todoFilter"
                type="text"
                className="form-control"
                value={value}
                onChange={handleFilterChange}
                placeholder={t('Поиск...')}
            />
        </div>
    );
}
