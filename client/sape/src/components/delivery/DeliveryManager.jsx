// src/components/delivery/DeliveryManager.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDeliveries,
    fetchDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery,
} from '../../redux/slices/deliverySlice';
import { useNavigate } from 'react-router-dom';

// Импортируем стили Bootstrap прямо в компонент (не рекомендуется для реального проекта)
import 'bootstrap/dist/css/bootstrap.min.css';

// Список допустимых типов оборудования (дублируем из модели)
const EQUIPMENT_TYPES = [
    'АЦП NM с AM1',
    'АЦП NM без усилителя',
    'АЦП NM с U2',
    'АЦП NM с AM2',
    // Добавьте другие типы оборудования по мере необходимости
];

const DeliveryManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, currentItem, status, error } = useSelector((state) => state.deliveries);

    // Локальное состояние для управления режимом компонента
    const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit' | 'detail'
    const [selectedId, setSelectedId] = useState(null);

    // Локальное состояние для формы
    const [formData, setFormData] = useState({
        contractNumber: '',
        equipmentType: '',
        userComment: '',
        employeeId: '',
        organizationId: '',
        deliveryDate: '',
        notes: '',
        status: 'pending',
    });

    // Локальное состояние для ошибок валидации
    const [errors, setErrors] = useState({});

    // Эффект для загрузки списка поставок при монтировании
    useEffect(() => {
        dispatch(fetchDeliveries());
    }, [dispatch]);

    // Эффект для загрузки деталей поставки при переключении в режим 'detail' или 'edit'
    useEffect(() => {
        if ((mode === 'detail' || mode === 'edit') && selectedId) {
            dispatch(fetchDeliveryById(selectedId));
        }
    }, [dispatch, mode, selectedId]);

    // Эффект для заполнения формы при редактировании
    useEffect(() => {
        if (mode === 'edit' && currentItem) {
            setFormData({
                contractNumber: currentItem.contractNumber || '',
                equipmentType: currentItem.equipmentType || '',
                userComment: currentItem.userComment || '',
                employeeId: currentItem.employeeId || '',
                organizationId: currentItem.organizationId || '',
                deliveryDate: currentItem.deliveryDate
                    ? currentItem.deliveryDate.slice(0, 10)
                    : '',
                notes: currentItem.notes || '',
                status: currentItem.status || 'pending',
            });
            setErrors({});
        }
    }, [currentItem, mode]);

    // Обработчики переходов между режимами
    const handleCreate = () => {
        setMode('create');
        setSelectedId(null);
        setFormData({
            contractNumber: '',
            equipmentType: '',
            userComment: '',
            employeeId: '',
            organizationId: '',
            deliveryDate: '',
            notes: '',
            status: 'pending',
        });
        setErrors({});
    };

    const handleEdit = (id) => {
        setSelectedId(id);
        setMode('edit');
    };

    const handleDetail = (id) => {
        setSelectedId(id);
        setMode('detail');
    };

    const handleCancel = () => {
        setMode('list');
        setSelectedId(null);
        setFormData({
            contractNumber: '',
            equipmentType: '',
            userComment: '',
            employeeId: '',
            organizationId: '',
            deliveryDate: '',
            notes: '',
            status: 'pending',
        });
        setErrors({});
    };

    // Функция валидации отдельного поля
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'contractNumber':
                if (!value) {
                    error = 'Номер контракта обязателен';
                } else if (!/^CONTRACT-\d{4}-\d{2}$/.test(value)) {
                    error = 'Номер контракта должен соответствовать формату CONTRACT-XXXX-XX';
                } else if (value.length > 20) {
                    error = 'Номер контракта не может превышать 20 символов';
                }
                break;

            case 'equipmentType':
                if (!value) {
                    error = 'Тип оборудования обязателен';
                } else if (!EQUIPMENT_TYPES.includes(value)) {
                    error = 'Неверный тип оборудования';
                }
                break;

            case 'userComment':
                if (value.length > 500) {
                    error = 'Комментарий не может превышать 500 символов';
                }
                break;

            case 'employeeId':
                if (!value) {
                    error = 'Employee ID обязателен';
                }
                break;

            case 'organizationId':
                if (!value) {
                    error = 'Organization ID обязателен';
                }
                break;

            case 'deliveryDate':
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                        error = 'Дата поставки не может быть в будущем';
                    }
                }
                break;

            case 'notes':
                if (value.length > 1000) {
                    error = 'Заметки не могут превышать 1000 символов';
                }
                break;

            case 'status':
                if (!['pending', 'completed', 'canceled'].includes(value)) {
                    error = 'Неверный статус';
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === '';
    };

    // Функция валидации всей формы
    const validateForm = () => {
        const newErrors = {};

        // contractNumber
        if (!formData.contractNumber) {
            newErrors.contractNumber = 'Номер контракта обязателен';
        } else if (!/^CONTRACT-\d{4}-\d{2}$/.test(formData.contractNumber)) {
            newErrors.contractNumber = 'Номер контракта должен соответствовать формату CONTRACT-XXXX-XX';
        } else if (formData.contractNumber.length > 20) {
            newErrors.contractNumber = 'Номер контракта не может превышать 20 символов';
        }

        // equipmentType
        if (!formData.equipmentType) {
            newErrors.equipmentType = 'Тип оборудования обязателен';
        } else if (!EQUIPMENT_TYPES.includes(formData.equipmentType)) {
            newErrors.equipmentType = 'Неверный тип оборудования';
        }

        // userComment
        if (formData.userComment.length > 500) {
            newErrors.userComment = 'Комментарий не может превышать 500 символов';
        }

        // employeeId
        if (!formData.employeeId) {
            newErrors.employeeId = 'Employee ID обязателен';
        }

        // organizationId
        if (!formData.organizationId) {
            newErrors.organizationId = 'Organization ID обязателен';
        }

        // deliveryDate
        if (formData.deliveryDate) {
            const selectedDate = new Date(formData.deliveryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                newErrors.deliveryDate = 'Дата поставки не может быть в будущем';
            }
        }

        // notes
        if (formData.notes.length > 1000) {
            newErrors.notes = 'Заметки не могут превышать 1000 символов';
        }

        // status
        if (!['pending', 'completed', 'canceled'].includes(formData.status)) {
            newErrors.status = 'Неверный статус';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            if (mode === 'create') {
                await dispatch(createDelivery(formData)).unwrap();
                alert('Поставка успешно создана!');
            } else if (mode === 'edit') {
                await dispatch(updateDelivery({ id: selectedId, updatedData: formData })).unwrap();
                alert('Поставка успешно обновлена!');
            }
            setMode('list');
            setSelectedId(null);
            setFormData({
                contractNumber: '',
                equipmentType: '',
                userComment: '',
                employeeId: '',
                organizationId: '',
                deliveryDate: '',
                notes: '',
                status: 'pending',
            });
            setErrors({});
            dispatch(fetchDeliveries());
        } catch (err) {
            if (err.errors) {
                const serverErrors = {};
                err.errors.forEach((error) => {
                    if (error.toLowerCase().includes('contract number')) {
                        serverErrors.contractNumber = error;
                    } else if (error.toLowerCase().includes('equipment type')) {
                        serverErrors.equipmentType = error;
                    } else if (error.toLowerCase().includes('employee id')) {
                        serverErrors.employeeId = error;
                    } else if (error.toLowerCase().includes('organization id')) {
                        serverErrors.organizationId = error;
                    } else {
                        alert('Ошибка: ' + error);
                    }
                });
                setErrors((prev) => ({ ...prev, ...serverErrors }));
            } else if (err.message) {
                alert('Ошибка: ' + err.message);
            } else {
                alert('Неизвестная ошибка');
            }
        }
    };

    // Обработчик удаления поставки
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Вы действительно хотите удалить поставку?');
        if (!confirmed) return;

        try {
            await dispatch(deleteDelivery(id)).unwrap();
            alert('Поставка успешно удалена!');
            dispatch(fetchDeliveries());
        } catch (err) {
            if (err.message) {
                alert('Ошибка при удалении: ' + err.message);
            } else {
                alert('Не удалось удалить поставку.');
            }
        }
    };

    // Функция для отображения сообщений об ошибках
    const renderError = (field) => {
        if (errors[field]) {
            return <div className="text-danger" style={{ fontSize: '0.875rem' }}>{errors[field]}</div>;
        }
        return null;
    };

    // Отображение компонента в зависимости от текущего режима
    const renderContent = () => {
        switch (mode) {
            case 'list':
                return (
                    <div>
                        <h2>Список поставок</h2>
                        <button className="btn btn-primary mb-3" onClick={handleCreate}>
                            Добавить поставку
                        </button>
                        {status === 'loading' && <p>Загрузка...</p>}
                        {status === 'failed' && (
                            <p className="text-danger">Ошибка: {error}</p>
                        )}
                        {status === 'succeeded' && (
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Номер контракта</th>
                                        <th>Тип оборудования</th>
                                        <th>Статус</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((delivery) => (
                                        <tr key={delivery._id}>
                                            <td>{delivery.contractNumber}</td>
                                            <td>{delivery.equipmentType}</td>
                                            <td>{delivery.status}</td>
                                            <td>
                                                <button
                                                    className="btn btn-info btn-sm me-2"
                                                    onClick={() => handleDetail(delivery._id)}
                                                >
                                                    Подробнее
                                                </button>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(delivery._id)}
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(delivery._id)}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                Нет данных
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 'create':
            case 'edit':
                return (
                    <div>
                        <h2>{mode === 'create' ? 'Создать поставку' : 'Редактировать поставку'}</h2>
                        <form onSubmit={handleSubmit} className="row g-3 mt-3">
                            <div className="col-12">
                                <label className="form-label">
                                    Номер контракта:
                                </label>
                                <input
                                    type="text"
                                    name="contractNumber"
                                    className="form-control"
                                    value={formData.contractNumber}
                                    onChange={handleChange}
                                    required
                                    pattern="^CONTRACT-\d{4}-\d{2}$"
                                    title="Формат CONTRACT-XXXX-XX"
                                />
                                {renderError('contractNumber')}
                                <div className="form-text">
                                    Формат: CONTRACT-XXXX-XX, максимум 20 символов
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Тип оборудования:</label>
                                <select
                                    name="equipmentType"
                                    className="form-select"
                                    value={formData.equipmentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите</option>
                                    {EQUIPMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {renderError('equipmentType')}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    className="form-control"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                />
                                {renderError('employeeId')}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Organization ID:</label>
                                <input
                                    type="text"
                                    name="organizationId"
                                    className="form-control"
                                    value={formData.organizationId}
                                    onChange={handleChange}
                                    required
                                />
                                {renderError('organizationId')}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Дата поставки:</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    className="form-control"
                                    value={formData.deliveryDate}
                                    onChange={handleChange}
                                />
                                {renderError('deliveryDate')}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Статус:</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="pending">pending</option>
                                    <option value="completed">completed</option>
                                    <option value="canceled">canceled</option>
                                </select>
                                {renderError('status')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Комментарий пользователя:</label>
                                <textarea
                                    name="userComment"
                                    className="form-control"
                                    value={formData.userComment}
                                    onChange={handleChange}
                                    maxLength={500}
                                />
                                {renderError('userComment')}
                                <div className="form-text">
                                    Максимум 500 символов
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Заметки:</label>
                                <textarea
                                    name="notes"
                                    className="form-control"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    maxLength={1000}
                                />
                                {renderError('notes')}
                                <div className="form-text">
                                    Максимум 1000 символов
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={status === 'loading'}
                                >
                                    {mode === 'create' ? 'Создать' : 'Сохранить изменения'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'detail':
                return (
                    <div>
                        <h2>Детали поставки</h2>
                        {status === 'loading' && <p>Загрузка...</p>}
                        {status === 'failed' && <p className="text-danger">Ошибка: {error}</p>}
                        {status === 'succeeded' && currentItem && (
                            <div className="card p-3">
                                <p>
                                    <strong>Номер контракта:</strong> {currentItem.contractNumber}
                                </p>
                                <p>
                                    <strong>Тип оборудования:</strong> {currentItem.equipmentType}
                                </p>
                                <p>
                                    <strong>Комментарий:</strong> {currentItem.userComment || '—'}
                                </p>
                                <p>
                                    <strong>Employee ID:</strong>{' '}
                                    {currentItem.employeeId?._id || currentItem.employeeId}
                                </p>
                                <p>
                                    <strong>Organization ID:</strong>{' '}
                                    {currentItem.organizationId?._id || currentItem.organizationId}
                                </p>
                                <p>
                                    <strong>Дата поставки:</strong>{' '}
                                    {currentItem.deliveryDate
                                        ? new Date(currentItem.deliveryDate).toLocaleDateString()
                                        : '—'}
                                </p>
                                <p>
                                    <strong>Заметки:</strong> {currentItem.notes || '—'}
                                </p>
                                <p>
                                    <strong>Статус:</strong> {currentItem.status}
                                </p>
                                {/* Добавьте дополнительные поля или фото при необходимости */}
                                <div className="mt-3">
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => setMode('edit')}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setMode('list')}
                                    >
                                        Назад к списку
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container py-4">
            {renderContent()}
        </div>
    );
};

export default DeliveryManager;
