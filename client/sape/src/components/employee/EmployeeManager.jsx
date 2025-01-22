// src/components/employee/EmployeeManager.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../../redux/slices/employeeSlice';
import axios from '../../redux/axios'; // Для загрузки фото, если нужно
import { useNavigate } from 'react-router-dom';

// Импортируем стили Bootstrap прямо в компонент (не рекомендуется для реального проекта)
import 'bootstrap/dist/css/bootstrap.min.css';

// Регулярные выражения для валидации (дублируем из модели)
const PHONE_REGEX = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
const EMAIL_REGEX = /.+\@.+\..+/;
const EMPLOYEE_CODE_REGEX = /^EMP-\d{4}$/;
const DEPARTMENT_CODE_REGEX = /^DEP-\d{3}$/;
const URL_REGEX = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;

const EmployeeManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, currentItem, status, error } = useSelector((state) => state.employees);

    // Локальное состояние для управления текущим режимом:
    // 'list' | 'create' | 'edit' | 'detail'
    const [mode, setMode] = useState('list');
    const [selectedId, setSelectedId] = useState(null);

    // Локальное состояние формы
    const [formData, setFormData] = useState({
        employeeCode: '',
        departmentCode: '',
        fullName: '',
        position: '',
        salary: 0,
        bonus: 0,
        month: 1,
        photo: '',
        hireDate: '',
        contactInfo: {
            phone: '',
            email: '',
            address: '',
        },
    });

    // Локальное состояние для ошибок валидации
    const [errors, setErrors] = useState({});

    // При монтировании компонента загружаем список сотрудников
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    // Если переходим в режим 'detail' или 'edit', загружаем данные сотрудника
    useEffect(() => {
        if ((mode === 'detail' || mode === 'edit') && selectedId) {
            dispatch(fetchEmployeeById(selectedId));
        }
    }, [mode, selectedId, dispatch]);

    // Если currentItem загрузился и мы в режиме 'edit', заполняем форму
    useEffect(() => {
        if (mode === 'edit' && currentItem) {
            setFormData({
                employeeCode: currentItem.employeeCode || '',
                departmentCode: currentItem.departmentCode || '',
                fullName: currentItem.fullName || '',
                position: currentItem.position || '',
                salary: currentItem.salary || 0,
                bonus: currentItem.bonus || 0,
                month: currentItem.month || 1,
                photo: currentItem.photo || '',
                hireDate: currentItem.hireDate
                    ? currentItem.hireDate.slice(0, 10)
                    : '',
                contactInfo: {
                    phone: currentItem.contactInfo?.phone || '',
                    email: currentItem.contactInfo?.email || '',
                    address: currentItem.contactInfo?.address || '',
                },
            });
            setErrors({});
        }
    }, [currentItem, mode]);

    // Обработчики смены режима
    const handleCreate = () => {
        setMode('create');
        setSelectedId(null);
        setFormData({
            employeeCode: '',
            departmentCode: '',
            fullName: '',
            position: '',
            salary: 0,
            bonus: 0,
            month: 1,
            photo: '',
            hireDate: '',
            contactInfo: {
                phone: '',
                email: '',
                address: '',
            },
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
            employeeCode: '',
            departmentCode: '',
            fullName: '',
            position: '',
            salary: 0,
            bonus: 0,
            month: 1,
            photo: '',
            hireDate: '',
            contactInfo: {
                phone: '',
                email: '',
                address: '',
            },
        });
        setErrors({});
    };

    // Функция валидации отдельного поля
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'employeeCode':
                if (!value) {
                    error = 'Employee code is required';
                } else if (!EMPLOYEE_CODE_REGEX.test(value)) {
                    error = 'Employee code must follow the format EMP-XXXX';
                } else if (value.length > 50) {
                    error = 'Employee code cannot exceed 50 characters';
                }
                break;

            case 'departmentCode':
                if (!value) {
                    error = 'Department code is required';
                } else if (!DEPARTMENT_CODE_REGEX.test(value)) {
                    error = 'Department code must follow the format DEP-XXX';
                } else if (value.length > 50) {
                    error = 'Department code cannot exceed 50 characters';
                }
                break;

            case 'fullName':
                if (!value) {
                    error = 'Full name is required';
                } else if (value.length < 3) {
                    error = 'Full name must be at least 3 characters long';
                } else if (value.length > 100) {
                    error = 'Full name cannot exceed 100 characters';
                }
                break;

            case 'position':
                if (!value) {
                    error = 'Position is required';
                } else if (value.length > 100) {
                    error = 'Position cannot exceed 100 characters';
                }
                break;

            case 'salary':
                if (value === '') {
                    error = 'Salary is required';
                } else if (value < 0) {
                    error = 'Salary cannot be negative';
                } else if (value > 1000000) {
                    error = 'Salary exceeds the maximum allowed value';
                }
                break;

            case 'bonus':
                if (value < 0) {
                    error = 'Bonus cannot be negative';
                } else if (value > 50000) {
                    error = 'Bonus exceeds the maximum allowed value';
                }
                break;

            case 'month':
                if (!value) {
                    error = 'Month is required';
                } else if (value < 1 || value > 12) {
                    error = 'Month must be between 1 and 12';
                }
                break;

            case 'photo':
                if (value && !URL_REGEX.test(value)) {
                    error = 'Invalid photo URL. Must be a valid image URL.';
                }
                break;

            case 'hireDate':
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                        error = 'Hire date cannot be in the future';
                    }
                }
                break;

            case 'contactInfo.phone':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!PHONE_REGEX.test(value)) {
                    error = 'Please enter a valid phone number format: +7 (999) 999-99-99';
                }
                break;

            case 'contactInfo.email':
                if (!value) {
                    error = 'Email is required';
                } else if (!EMAIL_REGEX.test(value)) {
                    error = 'Please enter a valid email';
                }
                break;

            case 'contactInfo.address':
                if (value.length > 200) {
                    error = 'Address cannot exceed 200 characters';
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

        // Валидация employeeCode
        if (!formData.employeeCode) {
            newErrors.employeeCode = 'Employee code is required';
        } else if (!EMPLOYEE_CODE_REGEX.test(formData.employeeCode)) {
            newErrors.employeeCode = 'Employee code must follow the format EMP-XXXX';
        } else if (formData.employeeCode.length > 50) {
            newErrors.employeeCode = 'Employee code cannot exceed 50 characters';
        }

        // Валидация departmentCode
        if (!formData.departmentCode) {
            newErrors.departmentCode = 'Department code is required';
        } else if (!DEPARTMENT_CODE_REGEX.test(formData.departmentCode)) {
            newErrors.departmentCode = 'Department code must follow the format DEP-XXX';
        } else if (formData.departmentCode.length > 50) {
            newErrors.departmentCode = 'Department code cannot exceed 50 characters';
        }

        // Валидация fullName
        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters long';
        } else if (formData.fullName.length > 100) {
            newErrors.fullName = 'Full name cannot exceed 100 characters';
        }

        // Валидация position
        if (!formData.position) {
            newErrors.position = 'Position is required';
        } else if (formData.position.length > 100) {
            newErrors.position = 'Position cannot exceed 100 characters';
        }

        // Валидация salary
        if (formData.salary === '') {
            newErrors.salary = 'Salary is required';
        } else if (formData.salary < 0) {
            newErrors.salary = 'Salary cannot be negative';
        } else if (formData.salary > 1000000) {
            newErrors.salary = 'Salary exceeds the maximum allowed value';
        }

        // Валидация bonus
        if (formData.bonus < 0) {
            newErrors.bonus = 'Bonus cannot be negative';
        } else if (formData.bonus > 50000) {
            newErrors.bonus = 'Bonus exceeds the maximum allowed value';
        }

        // Валидация month
        if (!formData.month) {
            newErrors.month = 'Month is required';
        } else if (formData.month < 1 || formData.month > 12) {
            newErrors.month = 'Month must be between 1 and 12';
        }

        // Валидация photo
        if (formData.photo && !URL_REGEX.test(formData.photo)) {
            newErrors.photo = 'Invalid photo URL. Must be a valid image URL.';
        }

        // Валидация hireDate
        if (formData.hireDate) {
            const selectedDate = new Date(formData.hireDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                newErrors.hireDate = 'Hire date cannot be in the future';
            }
        }

        // Валидация contactInfo.phone
        if (!formData.contactInfo.phone) {
            newErrors['contactInfo.phone'] = 'Phone number is required';
        } else if (!PHONE_REGEX.test(formData.contactInfo.phone)) {
            newErrors['contactInfo.phone'] = 'Please enter a valid phone number format: +7 (999) 999-99-99';
        }

        // Валидация contactInfo.email
        if (!formData.contactInfo.email) {
            newErrors['contactInfo.email'] = 'Email is required';
        } else if (!EMAIL_REGEX.test(formData.contactInfo.email)) {
            newErrors['contactInfo.email'] = 'Please enter a valid email';
        }

        // Валидация contactInfo.address
        if (formData.contactInfo.address.length > 200) {
            newErrors['contactInfo.address'] = 'Address cannot exceed 200 characters';
        }

        setErrors(newErrors);

        // Возвращаем true, если нет ошибок
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик изменения полей формы (учитываем вложенный contactInfo)
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Если это поле contactInfo.*
        if (name.startsWith('contactInfo.')) {
            const subField = name.split('.')[1]; // phone | email | address
            setFormData((prev) => ({
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    [subField]: value,
                },
            }));
            validateField(name, value);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            validateField(name, value);
        }
    };

    // Обработчик загрузки фото (при необходимости)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const uploadData = new FormData();
            uploadData.append('image', file);
            const response = await axios.post('/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // response.data.url содержит ПУТЬ, например "/uploads/4FrBrOiLjrA.png"
            // Для прохождения схемы нужна полная ссылка:
            const fullUrl = `http://localhost:4444${response.data.url}`;

            setFormData((prev) => ({ ...prev, photo: fullUrl }));
            setErrors((prev) => ({ ...prev, photo: '' }));
            alert('Фото успешно загружено!');
        } catch (err) {
            alert('Ошибка при загрузке фото: ' + err.message);
        }
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            if (mode === 'create') {
                // Создание
                await dispatch(createEmployee(formData)).unwrap();
                alert('Сотрудник успешно создан!');
            } else if (mode === 'edit') {
                // Обновление
                await dispatch(updateEmployee({ id: selectedId, updatedData: formData })).unwrap();
                alert('Сотрудник успешно обновлён!');
            }
            // Возвращаемся к списку
            setMode('list');
            setSelectedId(null);
            setFormData({
                employeeCode: '',
                departmentCode: '',
                fullName: '',
                position: '',
                salary: 0,
                bonus: 0,
                month: 1,
                photo: '',
                hireDate: '',
                contactInfo: {
                    phone: '',
                    email: '',
                    address: '',
                },
            });
            setErrors({});
            dispatch(fetchEmployees());
        } catch (err) {
            if (err.errors) {
                const serverErrors = {};
                err.errors.forEach((error) => {
                    // Определяем, к какому полю относится ошибка
                    if (error.toLowerCase().includes('employee code')) {
                        serverErrors.employeeCode = error;
                    } else if (error.toLowerCase().includes('department code')) {
                        serverErrors.departmentCode = error;
                    } else if (error.toLowerCase().includes('full name')) {
                        serverErrors.fullName = error;
                    } else if (error.toLowerCase().includes('position')) {
                        serverErrors.position = error;
                    } else if (error.toLowerCase().includes('salary')) {
                        serverErrors.salary = error;
                    } else if (error.toLowerCase().includes('bonus')) {
                        serverErrors.bonus = error;
                    } else if (error.toLowerCase().includes('month')) {
                        serverErrors.month = error;
                    } else if (error.toLowerCase().includes('photo')) {
                        serverErrors.photo = error;
                    } else if (error.toLowerCase().includes('hire date')) {
                        serverErrors.hireDate = error;
                    } else if (error.toLowerCase().includes('phone number')) {
                        serverErrors['contactInfo.phone'] = error;
                    } else if (error.toLowerCase().includes('email')) {
                        serverErrors['contactInfo.email'] = error;
                    } else if (error.toLowerCase().includes('address')) {
                        serverErrors['contactInfo.address'] = error;
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

    // Удаление сотрудника
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Вы действительно хотите удалить сотрудника?');
        if (!confirmed) return;
        try {
            await dispatch(deleteEmployee(id)).unwrap();
            alert('Сотрудник успешно удалён!');
            dispatch(fetchEmployees());
        } catch (err) {
            if (err.message) {
                alert('Ошибка при удалении: ' + err.message);
            } else {
                alert('Не удалось удалить сотрудника.');
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

    // Функция для отображения подсказок
    const renderHelperText = (field) => {
        switch (field) {
            case 'employeeCode':
                return <small className="form-text text-muted">Формат: EMP-XXXX, максимум 50 символов</small>;
            case 'departmentCode':
                return <small className="form-text text-muted">Формат: DEP-XXX, максимум 50 символов</small>;
            case 'fullName':
                return <small className="form-text text-muted">Минимум 3 символа, максимум 100 символов</small>;
            case 'position':
                return <small className="form-text text-muted">Максимум 100 символов</small>;
            case 'salary':
                return <small className="form-text text-muted">Минимум 0, максимум 1,000,000</small>;
            case 'bonus':
                return <small className="form-text text-muted">Минимум 0, максимум 50,000</small>;
            case 'month':
                return <small className="form-text text-muted">От 1 до 12</small>;
            case 'photo':
                return <small className="form-text text-muted">Допустимые форматы: png, jpg, jpeg, gif, svg</small>;
            case 'hireDate':
                return <small className="form-text text-muted">Не может быть в будущем</small>;
            case 'contactInfo.phone':
                return <small className="form-text text-muted">Формат: +7 (999) 999-99-99</small>;
            case 'contactInfo.email':
                return <small className="form-text text-muted">Должен быть валидным email</small>;
            case 'contactInfo.address':
                return <small className="form-text text-muted">Максимум 200 символов</small>;
            default:
                return null;
        }
    };

    // Функция отрисовки содержимого в зависимости от режима
    const renderContent = () => {
        switch (mode) {
            case 'list':
                return (
                    <div>
                        <h2>Список сотрудников</h2>
                        <button className="btn btn-primary mb-3" onClick={handleCreate}>
                            Добавить сотрудника
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
                                        <th>Employee Code</th>
                                        <th>Full Name</th>
                                        <th>Position</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((emp) => (
                                        <tr key={emp._id}>
                                            <td>{emp.employeeCode}</td>
                                            <td>{emp.fullName}</td>
                                            <td>{emp.position}</td>
                                            <td>
                                                <button
                                                    className="btn btn-info btn-sm me-2"
                                                    onClick={() => handleDetail(emp._id)}
                                                >
                                                    Подробнее
                                                </button>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(emp._id)}
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(emp._id)}
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
                        <h2>{mode === 'create' ? 'Создать сотрудника' : 'Редактировать сотрудника'}</h2>
                        <form onSubmit={handleSubmit} className="row g-3 mt-3">
                            <div className="col-12">
                                <label className="form-label">Employee Code:</label>
                                <input
                                    type="text"
                                    name="employeeCode"
                                    className={`form-control ${errors.employeeCode ? 'is-invalid' : ''}`}
                                    value={formData.employeeCode}
                                    onChange={handleChange}
                                    required
                                    pattern="^EMP-\d{4}$"
                                    title="Формат EMP-XXXX"
                                />
                                {renderError('employeeCode')}
                                {renderHelperText('employeeCode')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Department Code:</label>
                                <input
                                    type="text"
                                    name="departmentCode"
                                    className={`form-control ${errors.departmentCode ? 'is-invalid' : ''}`}
                                    value={formData.departmentCode}
                                    onChange={handleChange}
                                    required
                                    pattern="^DEP-\d{3}$"
                                    title="Формат DEP-XXX"
                                />
                                {renderError('departmentCode')}
                                {renderHelperText('departmentCode')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Full Name:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                                {renderError('fullName')}
                                {renderHelperText('fullName')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Position:</label>
                                <input
                                    type="text"
                                    name="position"
                                    className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                                {renderError('position')}
                                {renderHelperText('position')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Salary:</label>
                                <input
                                    type="number"
                                    name="salary"
                                    className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required
                                    min={0}
                                    max={1000000}
                                />
                                {renderError('salary')}
                                {renderHelperText('salary')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Bonus:</label>
                                <input
                                    type="number"
                                    name="bonus"
                                    className={`form-control ${errors.bonus ? 'is-invalid' : ''}`}
                                    value={formData.bonus}
                                    onChange={handleChange}
                                    min={0}
                                    max={50000}
                                />
                                {renderError('bonus')}
                                {renderHelperText('bonus')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Month:</label>
                                <input
                                    type="number"
                                    name="month"
                                    className={`form-control ${errors.month ? 'is-invalid' : ''}`}
                                    value={formData.month}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    max={12}
                                />
                                {renderError('month')}
                                {renderHelperText('month')}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Hire Date:</label>
                                <input
                                    type="date"
                                    name="hireDate"
                                    className={`form-control ${errors.hireDate ? 'is-invalid' : ''}`}
                                    value={formData.hireDate}
                                    onChange={handleChange}
                                />
                                {renderError('hireDate')}
                                {renderHelperText('hireDate')}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Photo:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                                    onChange={handleFileChange}
                                />
                                {renderError('photo')}
                                {renderHelperText('photo')}
                                {formData.photo && (
                                    <div className="mt-2">
                                        <img
                                            src={`http://localhost:4444${formData.photo}`}
                                            alt="Employee"
                                            className="img-thumbnail"
                                            style={{ maxWidth: '200px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Contact Info */}
                            <fieldset className="col-12 border p-3">
                                <legend className="w-auto px-2">Contact Info</legend>

                                <div className="mb-3">
                                    <label className="form-label">Phone:</label>
                                    <input
                                        type="text"
                                        name="contactInfo.phone"
                                        className={`form-control ${errors['contactInfo.phone'] ? 'is-invalid' : ''}`}
                                        value={formData.contactInfo.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$"
                                        title="Формат +7 (999) 999-99-99"
                                    />
                                    {renderError('contactInfo.phone')}
                                    {renderHelperText('contactInfo.phone')}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        name="contactInfo.email"
                                        className={`form-control ${errors['contactInfo.email'] ? 'is-invalid' : ''}`}
                                        value={formData.contactInfo.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {renderError('contactInfo.email')}
                                    {renderHelperText('contactInfo.email')}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Address:</label>
                                    <input
                                        type="text"
                                        name="contactInfo.address"
                                        className={`form-control ${errors['contactInfo.address'] ? 'is-invalid' : ''}`}
                                        value={formData.contactInfo.address}
                                        onChange={handleChange}
                                        maxLength={200}
                                    />
                                    {renderError('contactInfo.address')}
                                    {renderHelperText('contactInfo.address')}
                                </div>
                            </fieldset>

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
                        <h2>Детали сотрудника</h2>
                        {status === 'loading' && <p>Загрузка...</p>}
                        {status === 'failed' && (
                            <div className="alert alert-danger" role="alert">
                                Ошибка: {error}
                            </div>
                        )}
                        {status === 'succeeded' && currentItem && (
                            <div className="card p-4">
                                <div className="row">
                                    <div className="col-md-4 text-center">
                                        {currentItem.photo ? (
                                            <img
                                                src={currentItem.photo}
                                                alt="Employee"
                                                className="img-fluid rounded mb-3"
                                            />
                                        ) : (
                                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                                                Нет фото
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <p><strong>Employee Code:</strong> {currentItem.employeeCode}</p>
                                        <p><strong>Department Code:</strong> {currentItem.departmentCode}</p>
                                        <p><strong>Full Name:</strong> {currentItem.fullName}</p>
                                        <p><strong>Position:</strong> {currentItem.position}</p>
                                        <p><strong>Salary:</strong> {currentItem.salary}</p>
                                        <p><strong>Bonus:</strong> {currentItem.bonus}</p>
                                        <p><strong>Month:</strong> {currentItem.month}</p>
                                        <p><strong>Hire Date:</strong> {currentItem.hireDate ? new Date(currentItem.hireDate).toLocaleDateString() : '—'}</p>

                                        <h5>Contact Info</h5>
                                        <p><strong>Phone:</strong> {currentItem.contactInfo?.phone}</p>
                                        <p><strong>Email:</strong> {currentItem.contactInfo?.email}</p>
                                        <p><strong>Address:</strong> {currentItem.contactInfo?.address}</p>

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

export default EmployeeManager;
