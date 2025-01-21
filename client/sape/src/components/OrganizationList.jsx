import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';  // <-- Импорт Bootstrap
import axiosInstance from '../api/axiosInstance';
import {
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
} from '../store/organizationSlice';

const OrganizationList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.organizations);

    // Состояния для загрузки договоров
    const [contracts, setContracts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [detailOrganization, setDetailOrganization] = useState(null);

    const [formData, setFormData] = useState({
        contract_id: '',
        country_code: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        website: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Загрузка списка организаций
        dispatch(fetchOrganizations({ page: 1, limit: 10 }));

        // Загрузка списка договоров
        axiosInstance
            .get('/contracts')
            .then((response) => {
                setContracts(response.data.data || response.data);
            })
            .catch((err) => {
                console.error('Ошибка при загрузке договоров:', err);
            });
    }, [dispatch]);

    // Валидация формы
    const validate = () => {
        const errors = {};
        if (!formData.contract_id) errors.contract_id = 'Договор обязателен';
        if (!formData.country_code) errors.country_code = 'Country code обязателен';
        if (!formData.city) errors.city = 'City обязателен';
        if (!formData.address) errors.address = 'Address обязателен';
        if (!formData.phone) errors.phone = 'Phone обязателен';
        if (!formData.email) errors.email = 'Email обязателен';
        return errors;
    };

    // Обработчик для добавления новой организации
    const handleAdd = () => {
        setEditingOrganization(null);
        setFormData({
            contract_id: '',
            country_code: '',
            city: '',
            address: '',
            phone: '',
            email: '',
            website: '',
        });
        setFormErrors({});
        setShowForm(true);
    };

    // Обработчик для редактирования
    const handleEdit = (org) => {
        setEditingOrganization(org);
        setFormData({
            contract_id: org.contract_id || '',
            country_code: org.country_code || '',
            city: org.city || '',
            address: org.address || '',
            phone: org.phone || '',
            email: org.email || '',
            website: org.website || '',
        });
        setFormErrors({});
        setShowForm(true);
    };

    // Обработчик для удаления
    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту организацию?')) {
            dispatch(deleteOrganization(id))
                .unwrap()
                .catch((err) => alert('Невозможно удалить запись: ' + err));
        }
    };

    // Сабмит формы добавления/редактирования
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        if (editingOrganization) {
            dispatch(
                updateOrganization({
                    id: editingOrganization.organization_id,
                    ...formData,
                })
            );
        } else {
            dispatch(createOrganization(formData));
        }
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Ошибка: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Список организаций</h2>

            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Добавить организацию
            </button>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Договор</th>
                            <th>Страна</th>
                            <th>Город</th>
                            <th>Email</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((org) => {
                            const contract = contracts.find((c) => c.contract_id === org.contract_id);
                            return (
                                <tr key={org.organization_id}>
                                    <td>{org.organization_id}</td>
                                    <td>
                                        {org.contract_id}
                                        {contract ? ` (${contract.organization_name})` : ''}
                                    </td>
                                    <td>{org.country_code}</td>
                                    <td>{org.city}</td>
                                    <td>{org.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => handleEdit(org)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger mr-2"
                                            onClick={() => handleDelete(org.organization_id)}
                                        >
                                            Удалить
                                        </button>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => setDetailOrganization(org)}
                                        >
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Форма добавления/редактирования организации */}
            {showForm && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">
                            {editingOrganization
                                ? 'Редактировать организацию'
                                : 'Добавить организацию'}
                        </h5>
                        <form onSubmit={handleSubmit}>
                            {/* Договор */}
                            <div className="form-group">
                                <label>Договор:</label>
                                <select
                                    className="form-control"
                                    value={formData.contract_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, contract_id: e.target.value })
                                    }
                                >
                                    <option value="">Выберите договор</option>
                                    {contracts.map((contract) => (
                                        <option
                                            key={contract.contract_id}
                                            value={contract.contract_id}
                                        >
                                            {contract.organization_name} (ID: {contract.contract_id})
                                        </option>
                                    ))}
                                </select>
                                {formErrors.contract_id && (
                                    <small className="text-danger">{formErrors.contract_id}</small>
                                )}
                            </div>

                            {/* Country Code */}
                            <div className="form-group">
                                <label>Country Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.country_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country_code: e.target.value })
                                    }
                                />
                                {formErrors.country_code && (
                                    <small className="text-danger">
                                        {formErrors.country_code}
                                    </small>
                                )}
                            </div>

                            {/* City */}
                            <div className="form-group">
                                <label>City:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                />
                                {formErrors.city && (
                                    <small className="text-danger">{formErrors.city}</small>
                                )}
                            </div>

                            {/* Address */}
                            <div className="form-group">
                                <label>Address:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                />
                                {formErrors.address && (
                                    <small className="text-danger">{formErrors.address}</small>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                                {formErrors.phone && (
                                    <small className="text-danger">{formErrors.phone}</small>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                                {formErrors.email && (
                                    <small className="text-danger">{formErrors.email}</small>
                                )}
                            </div>

                            {/* Website */}
                            <div className="form-group">
                                <label>Website:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({ ...formData, website: e.target.value })
                                    }
                                />
                            </div>

                            {/* Кнопки сохранить/отмена */}
                            <button type="submit" className="btn btn-success mr-2">
                                Сохранить
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Отмена
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Подробная информация об организации */}
            {detailOrganization && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Детали организации</h5>
                        <p>
                            <strong>ID:</strong> {detailOrganization.organization_id}
                        </p>
                        <p>
                            <strong>Договор ID:</strong> {detailOrganization.contract_id}
                        </p>
                        <p>
                            <strong>Country Code:</strong> {detailOrganization.country_code}
                        </p>
                        <p>
                            <strong>City:</strong> {detailOrganization.city}
                        </p>
                        <p>
                            <strong>Address:</strong> {detailOrganization.address}
                        </p>
                        <p>
                            <strong>Phone:</strong> {detailOrganization.phone}
                        </p>
                        <p>
                            <strong>Email:</strong> {detailOrganization.email}
                        </p>
                        <p>
                            <strong>Website:</strong> {detailOrganization.website}
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setDetailOrganization(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationList;
