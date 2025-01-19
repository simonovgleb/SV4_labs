// src/components/TodoItemEdit.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTodo, setError, clearError } from '../features/firstSlice/firstSlice';
import { useTranslation } from 'react-i18next';

export default function TodoItemEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const error = useSelector((state) => state.first.error);
    const todo = useSelector((state) =>
        state.first.todos.find((t) => t.id === id)
    );

    const [title, setTitle] = useState(todo ? todo.title : '');

    if (!todo) {
        return <div className="alert alert-warning">{t('Задача не найдена')}</div>;
    }

    const handleSave = () => {
        if (!title.trim()) {
            dispatch(setError(t('todos.emptyNameError')));
            return;
        }
        dispatch(updateTodo({ id: todo.id, newTitle: title }));
        dispatch(clearError());
        navigate('/');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t('Редактирование задачи')}</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label htmlFor="todoTitle" className="form-label">
                    {t('Название')}:
                </label>
                <input
                    id="todoTitle"
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleSave}>
                    {t('Сохранить')}
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                    {t('Отмена')}
                </button>
            </div>
        </div>
    );
}
