// src/components/organization/OrganizationManager.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchOrganizations,
    fetchOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization
} from '../../redux/slices/organizationSlice';
import { useNavigate } from 'react-router-dom';

// Импортируем стили Bootstrap прямо в компонент
import 'bootstrap/dist/css/bootstrap.min.css';

// Регулярные выражения, взятые из модели:
const ORGANIZATION_CODE_REGEX = /^ORG-\d{4}$/;
const PHONE_REGEX = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
const EMAIL_REGEX = /.+\@.+\..+/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$/i;

const OrganizationManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Данные из Redux
    const { items, currentItem, status, error } = useSelector((state) => state.organizations);

    // Локальное состояние для управления режимами:
    // 'list' | 'create' | 'edit' | 'detail'
    const [mode, setMode] = useState('list');
    const [selectedId, setSelectedId] = useState(null);

    // Локальное состояние формы
    const [formData, setFormData] = useState({
        organizationCode: '',
        name: '',
        contractDate: '',
        country: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        description: '',
    });

    // Локальное состояние для ошибок валидации
    const [errors, setErrors] = useState({});

    // Загрузка списка организаций при монтировании
    useEffect(() => {
        dispatch(fetchOrganizations());
    }, [dispatch]);

    // Загрузка деталей организации при режиме 'detail' или 'edit'
    useEffect(() => {
        if ((mode === 'detail' || mode === 'edit') && selectedId) {
            dispatch(fetchOrganizationById(selectedId));
        }
    }, [dispatch, mode, selectedId]);

    // Заполнение формы при получении currentItem (для редактирования)
    useEffect(() => {
        if (mode === 'edit' && currentItem) {
            setFormData({
                organizationCode: currentItem.organizationCode || '',
                name: currentItem.name || '',
                contractDate: currentItem.contractDate
                    ? currentItem.contractDate.slice(0, 10)
                    : '',
                country: currentItem.country || '',
                city: currentItem.city || '',
                address: currentItem.address || '',
                phone: currentItem.phone || '',
                email: currentItem.email || '',
                website: currentItem.website || '',
                description: currentItem.description || '',
            });
            setErrors({});
        }
    }, [mode, currentItem]);

    // Обработчики переходов между режимами
    const handleCreate = () => {
        setMode('create');
        setSelectedId(null);
        setFormData({
            organizationCode: '',
            name: '',
            contractDate: '',
            country: '',
            city: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            description: '',
        });
        setErrors({});
    };

    const handleDetail = (id) => {
        setSelectedId(id);
        setMode('detail');
    };

    const handleEdit = (id) => {
        setSelectedId(id);
        setMode('edit');
    };

    const handleCancel = () => {
        setMode('list');
        setSelectedId(null);
        setFormData({
            organizationCode: '',
            name: '',
            contractDate: '',
            country: '',
            city: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            description: '',
        });
        setErrors({});
    };

    // Удаление организации
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Вы действительно хотите удалить организацию?');
        if (!confirmed) return;
        try {
            await dispatch(deleteOrganization(id)).unwrap();
            alert('Организация успешно удалена!');
            dispatch(fetchOrganizations());
        } catch (err) {
            alert('Ошибка при удалении: ' + err.message);
        }
    };

    // Валидация конкретного поля
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'organizationCode':
                if (!value) {
                    error = 'Organization code is required';
                } else if (!ORGANIZATION_CODE_REGEX.test(value)) {
                    error = 'Organization code must follow the format ORG-XXXX';
                } else if (value.length > 20) {
                    error = 'Organization code cannot exceed 20 characters';
                }
                break;

            case 'name':
                if (!value) {
                    error = 'Organization name is required';
                } else if (value.length < 3) {
                    error = 'Organization name must be at least 3 characters long';
                } else if (value.length > 100) {
                    error = 'Organization name cannot exceed 100 characters';
                }
                break;

            case 'contractDate':
                if (!value) {
                    error = 'Contract date is required';
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                        error = 'Contract date cannot be in the future';
                    }
                }
                break;

            case 'country':
                if (!value) {
                    error = 'Country is required';
                } else if (value.length > 100) {
                    error = 'Country cannot exceed 100 characters';
                }
                break;

            case 'city':
                if (!value) {
                    error = 'City is required';
                } else if (value.length > 100) {
                    error = 'City cannot exceed 100 characters';
                }
                break;

            case 'address':
                if (!value) {
                    error = 'Address is required';
                } else if (value.length > 200) {
                    error = 'Address cannot exceed 200 characters';
                }
                break;

            case 'phone':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!PHONE_REGEX.test(value)) {
                    error = 'Please enter a valid phone number format: +7 (999) 999-99-99';
                }
                break;

            case 'email':
                if (!value) {
                    error = 'Email is required';
                } else if (!EMAIL_REGEX.test(value)) {
                    error = 'Please enter a valid email';
                }
                break;

            case 'website':
                // Сайт не обязателен, но если введён - должен соответствовать формату
                if (value && !URL_REGEX.test(value)) {
                    error = 'Invalid website URL';
                }
                break;

            case 'description':
                if (value.length > 1000) {
                    error = 'Description cannot exceed 1000 characters';
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === '';
    };

    // Валидация всей формы
    const validateForm = () => {
        const newErrors = {};

        // organizationCode
        if (!formData.organizationCode) {
            newErrors.organizationCode = 'Organization code is required';
        } else if (!ORGANIZATION_CODE_REGEX.test(formData.organizationCode)) {
            newErrors.organizationCode = 'Organization code must follow the format ORG-XXXX';
        } else if (formData.organizationCode.length > 20) {
            newErrors.organizationCode = 'Organization code cannot exceed 20 characters';
        }

        // name
        if (!formData.name) {
            newErrors.name = 'Organization name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Organization name must be at least 3 characters long';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Organization name cannot exceed 100 characters';
        }

        // contractDate
        if (!formData.contractDate) {
            newErrors.contractDate = 'Contract date is required';
        } else {
            const selectedDate = new Date(formData.contractDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                newErrors.contractDate = 'Contract date cannot be in the future';
            }
        }

        // country
        if (!formData.country) {
            newErrors.country = 'Country is required';
        } else if (formData.country.length > 100) {
            newErrors.country = 'Country cannot exceed 100 characters';
        }

        // city
        if (!formData.city) {
            newErrors.city = 'City is required';
        } else if (formData.city.length > 100) {
            newErrors.city = 'City cannot exceed 100 characters';
        }

        // address
        if (!formData.address) {
            newErrors.address = 'Address is required';
        } else if (formData.address.length > 200) {
            newErrors.address = 'Address cannot exceed 200 characters';
        }

        // phone
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!PHONE_REGEX.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number format: +7 (999) 999-99-99';
        }

        // email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // website (необязательное поле)
        if (formData.website && !URL_REGEX.test(formData.website)) {
            newErrors.website = 'Invalid website URL';
        }

        // description
        if (formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик изменения полей
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Отправка формы (создание / редактирование)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            if (mode === 'create') {
                // Создание
                await dispatch(createOrganization(formData)).unwrap();
                alert('Организация успешно создана!');
            } else if (mode === 'edit') {
                // Обновление
                await dispatch(updateOrganization({ id: selectedId, updatedData: formData })).unwrap();
                alert('Организация успешно обновлена!');
            }
            setMode('list');
            setSelectedId(null);
            setFormData({
                organizationCode: '',
                name: '',
                contractDate: '',
                country: '',
                city: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                description: '',
            });
            setErrors({});
            dispatch(fetchOrganizations());
        } catch (err) {
            if (err.errors) {
                const serverErrors = {};
                err.errors.forEach((error) => {
                    if (error.toLowerCase().includes('organization code')) {
                        serverErrors.organizationCode = error;
                    } else if (error.toLowerCase().includes('organization name') || error.toLowerCase().includes('name')) {
                        serverErrors.name = error;
                    } else if (error.toLowerCase().includes('contract date')) {
                        serverErrors.contractDate = error;
                    } else if (error.toLowerCase().includes('country')) {
                        serverErrors.country = error;
                    } else if (error.toLowerCase().includes('city')) {
                        serverErrors.city = error;
                    } else if (error.toLowerCase().includes('address')) {
                        serverErrors.address = error;
                    } else if (error.toLowerCase().includes('phone')) {
                        serverErrors.phone = error;
                    } else if (error.toLowerCase().includes('email')) {
                        serverErrors.email = error;
                    } else if (error.toLowerCase().includes('website')) {
                        serverErrors.website = error;
                    } else if (error.toLowerCase().includes('description')) {
                        serverErrors.description = error;
                    } else {
                        // Общая ошибка
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

    // Функция для отображения сообщений об ошибках
    const renderError = (field) => {
        if (errors[field]) {
            return <div className="text-danger" style={{ fontSize: '0.875rem' }}>{errors[field]}</div>;
        }
        return null;
    };

    // Функция для отображения подсказок (helper texts) под полями
    const renderHelperText = (field) => {
        switch (field) {
            case 'organizationCode':
                return <small className="form-text text-muted">Формат: ORG-XXXX, максимум 20 символов</small>;
            case 'name':
                return <small className="form-text text-muted">Минимум 3 символа, максимум 100 символов</small>;
            case 'contractDate':
                return <small className="form-text text-muted">Дата не может быть в будущем</small>;
            case 'country':
                return <small className="form-text text-muted">Максимум 100 символов</small>;
            case 'city':
                return <small className="form-text text-muted">Максимум 100 символов</small>;
            case 'address':
                return <small className="form-text text-muted">Максимум 200 символов</small>;
            case 'phone':
                return <small className="form-text text-muted">Формат: +7 (999) 999-99-99</small>;
            case 'email':
                return <small className="form-text text-muted">Должен быть валидным email</small>;
            case 'website':
                return <small className="form-text text-muted">Пример: http(s)://example.com</small>;
            case 'description':
                return <small className="form-text text-muted">Максимум 1000 символов</small>;
            default:
                return null;
        }
    };

    // Рендер контента в зависимости от mode
    const renderContent = () => {
        switch (mode) {
            case 'list':
                return (
                    <div>
                        <h2>Список организаций</h2>
                        <button className="btn btn-primary mb-3" onClick={handleCreate}>
                            Добавить организацию
                        </button>
                        {status === 'loading' && <p>Загрузка...</p>}
                        {status === 'failed' && (
                            <div className="alert alert-danger" role="alert">
                                Ошибка: {error}
                            </div>
                        )}
                        {status === 'succeeded' && (
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Код</th>
                                        <th>Наименование</th>
                                        <th>Город</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((org) => (
                                        <tr key={org._id}>
                                            <td>{org.organizationCode}</td>
                                            <td>{org.name}</td>
                                            <td>{org.city}</td>
                                            <td>
                                                <button
                                                    className="btn btn-info btn-sm me-2"
                                                    onClick={() => handleDetail(org._id)}
                                                >
                                                    Подробнее
                                                </button>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(org._id)}
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(org._id)}
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
                        <h2>{mode === 'create' ? 'Создать организацию' : 'Редактировать организацию'}</h2>
                        <form onSubmit={handleSubmit} className="row g-3 mt-3">
                            <div className="col-12">
                                <label className="form-label">Organization Code:</label>
                                <input
                                    type="text"
                                    name="organizationCode"
                                    className={`form-control ${errors.organizationCode ? 'is-invalid' : ''}`}
                                    value={formData.organizationCode}
                                    onChange={handleChange}
                                    required
                                    pattern="^ORG-\d{4}$"
                                    title="Формат ORG-XXXX"
                                />
                                {renderError('organizationCode')}
                                {renderHelperText('organizationCode')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Наименование:</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                                {renderError('name')}
                                {renderHelperText('name')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Дата контракта:</label>
                                <input
                                    type="date"
                                    name="contractDate"
                                    className={`form-control ${errors.contractDate ? 'is-invalid' : ''}`}
                                    value={formData.contractDate}
                                    onChange={handleChange}
                                    required
                                />
                                {renderError('contractDate')}
                                {renderHelperText('contractDate')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Страна:</label>
                                <input
                                    type="text"
                                    name="country"
                                    className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                                {renderError('country')}
                                {renderHelperText('country')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Город:</label>
                                <input
                                    type="text"
                                    name="city"
                                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                                {renderError('city')}
                                {renderHelperText('city')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Адрес:</label>
                                <input
                                    type="text"
                                    name="address"
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    maxLength={200}
                                />
                                {renderError('address')}
                                {renderHelperText('address')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Телефон:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    pattern="^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$"
                                    title="Формат +7 (999) 999-99-99"
                                />
                                {renderError('phone')}
                                {renderHelperText('phone')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {renderError('email')}
                                {renderHelperText('email')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Сайт:</label>
                                <input
                                    type="url"
                                    name="website"
                                    className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                                    value={formData.website}
                                    onChange={handleChange}
                                    pattern="^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$"
                                    title="URL-адрес"
                                />
                                {renderError('website')}
                                {renderHelperText('website')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Описание:</label>
                                <textarea
                                    name="description"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength={1000}
                                />
                                {renderError('description')}
                                {renderHelperText('description')}
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
                        <h2>Детали организации</h2>
                        {status === 'loading' && <p>Загрузка...</p>}
                        {status === 'failed' && (
                            <div className="alert alert-danger" role="alert">
                                Ошибка: {error}
                            </div>
                        )}
                        {status === 'succeeded' && currentItem && (
                            <div className="card p-3">
                                <p><strong>Код:</strong> {currentItem.organizationCode}</p>
                                <p><strong>Наименование:</strong> {currentItem.name}</p>
                                <p>
                                    <strong>Дата контракта:</strong>{' '}
                                    {currentItem.contractDate
                                        ? new Date(currentItem.contractDate).toLocaleDateString()
                                        : '—'}
                                </p>
                                <p><strong>Страна:</strong> {currentItem.country}</p>
                                <p><strong>Город:</strong> {currentItem.city}</p>
                                <p><strong>Адрес:</strong> {currentItem.address}</p>
                                <p><strong>Телефон:</strong> {currentItem.phone}</p>
                                <p><strong>Email:</strong> {currentItem.email}</p>
                                <p><strong>Сайт:</strong> {currentItem.website || '—'}</p>
                                <p><strong>Описание:</strong> {currentItem.description || '—'}</p>
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

export default OrganizationManager;
