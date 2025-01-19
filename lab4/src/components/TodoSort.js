// src/components/TodoSort.js
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TodoSort({ sortOrder, onChange }) {
    const { t } = useTranslation();

    const handleSortChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="mb-3">
            <label htmlFor="sortOrder" className="form-label">
                {t('Сортировать')}:
            </label>
            <select
                id="sortOrder"
                className="form-select"
                value={sortOrder}
                onChange={handleSortChange}
            >
                <option value="asc">{t('По возрастанию')}</option>
                <option value="desc">{t('По убыванию')}</option>
            </select>
        </div>
    );
}
