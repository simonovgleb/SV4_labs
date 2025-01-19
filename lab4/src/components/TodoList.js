// src/components/TodoList.js
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo, toggleTodo, setError, clearError } from '../features/firstSlice/firstSlice';
import { useTranslation } from 'react-i18next';
import TodoFilter from './TodoFilter';
import TodoSort from './TodoSort';
import { Link } from 'react-router-dom';

export default function TodoList() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.first.todos);
    const error = useSelector((state) => state.first.error);

    const [inputValue, setInputValue] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleAdd = () => {
        if (!inputValue.trim()) {
            dispatch(setError(t('todos.emptyNameError')));
            return;
        }
        dispatch(addTodo(inputValue));
        setInputValue('');
        dispatch(clearError());
    };

    const handleToggle = (id) => {
        dispatch(toggleTodo(id));
    };

    const handleRemove = (id) => {
        dispatch(removeTodo(id));
    };

    const filteredTodos = useMemo(() => {
        return todos.filter((todo) =>
            todo.title.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [todos, filterText]);

    const sortedTodos = useMemo(() => {
        const sorted = [...filteredTodos].sort((a, b) => {
            if (a.title < b.title) return sortOrder === 'asc' ? -1 : 1;
            if (a.title > b.title) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredTodos, sortOrder]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{t('todos.title')}</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Форма для создания */}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    placeholder={t('todos.title')}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAdd}>
                    {t('todos.addButton')}
                </button>
            </div>

            {/* Фильтр и сортировка */}
            <div className="mb-3">
                <TodoFilter value={filterText} onChange={setFilterText} />
                <TodoSort sortOrder={sortOrder} onChange={setSortOrder} />
            </div>

            {/* Список задач */}
            <ul className="list-group">
                {sortedTodos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'list-group-item-success' : ''
                            }`}
                    >
                        <div>
                            <label className="form-check-label">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    checked={todo.completed}
                                    onChange={() => handleToggle(todo.id)}
                                />
                                <span
                                    style={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.title}
                                </span>
                            </label>
                        </div>
                        <div>
                            <button
                                className="btn btn-danger btn-sm me-2"
                                onClick={() => handleRemove(todo.id)}
                            >
                                {t('todos.deleteButton')}
                            </button>
                            <Link to={`/edit/${todo.id}`} className="btn btn-secondary btn-sm">
                                {t('todos.editButton')}
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
