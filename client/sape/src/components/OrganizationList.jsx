import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import {
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
} from '../store/organizationSlice';

const OrganizationList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(state => state.organizations);

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
        website: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchOrganizations({ page: 1, limit: 10 }));

        // Загрузка списка договоров
        axiosInstance.get('/contracts')
            .then(response => {
                setContracts(response.data.data || response.data);
            })
            .catch(err => {
                console.error('Ошибка при загрузке договоров:', err);
            });
    }, [dispatch]);

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

    const handleAdd = () => {
        setEditingOrganization(null);
        setFormData({
            contract_id: '',
            country_code: '',
            city: '',
            address: '',
            phone: '',
            email: '',
            website: ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (org) => {
        setEditingOrganization(org);
        setFormData({
            contract_id: org.contract_id || '',
            country_code: org.country_code || '',
            city: org.city || '',
            address: org.address || '',
            phone: org.phone || '',
            email: org.email || '',
            website: org.website || ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту организацию?')) {
            dispatch(deleteOrganization(id))
                .unwrap()
                .catch(err => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (editingOrganization) {
            dispatch(updateOrganization({ id: editingOrganization.organization_id, ...formData }));
        } else {
            dispatch(createOrganization(formData));
        }
        setShowForm(false);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Список организаций</h2>
            <button onClick={handleAdd}>Добавить организацию</button>
            <table border="1" cellPadding="5">
                <thead>
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
                    {list.map(org => {
                        const contract = contracts.find(c => c.contract_id === org.contract_id);
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
                                    <button onClick={() => handleEdit(org)}>Редактировать</button>
                                    <button onClick={() => handleDelete(org.organization_id)}>Удалить</button>
                                    <button onClick={() => setDetailOrganization(org)}>Подробнее</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Форма добавления/редактирования организации */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h3>{editingOrganization ? 'Редактировать организацию' : 'Добавить организацию'}</h3>
                    <div>
                        <label>Договор:</label>
                        <select
                            value={formData.contract_id}
                            onChange={e => setFormData({ ...formData, contract_id: e.target.value })}
                        >
                            <option value="">Выберите договор</option>
                            {contracts.map(contract => (
                                <option key={contract.contract_id} value={contract.contract_id}>
                                    {contract.organization_name} (ID: {contract.contract_id})
                                </option>
                            ))}
                        </select>
                        {formErrors.contract_id && <span style={{ color: 'red' }}>{formErrors.contract_id}</span>}
                    </div>
                    <div>
                        <label>Country Code:</label>
                        <input
                            type="text"
                            value={formData.country_code}
                            onChange={e => setFormData({ ...formData, country_code: e.target.value })}
                        />
                        {formErrors.country_code && <span style={{ color: 'red' }}>{formErrors.country_code}</span>}
                    </div>
                    <div>
                        <label>City:</label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                        {formErrors.city && <span style={{ color: 'red' }}>{formErrors.city}</span>}
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                        {formErrors.address && <span style={{ color: 'red' }}>{formErrors.address}</span>}
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {formErrors.phone && <span style={{ color: 'red' }}>{formErrors.phone}</span>}
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
                    </div>
                    <div>
                        <label>Website:</label>
                        <input
                            type="text"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </form>
            )}

            {/* Подробная информация об организации */}
            {detailOrganization && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <h3>Детали организации</h3>
                    <p><strong>ID:</strong> {detailOrganization.organization_id}</p>
                    <p><strong>Договор ID:</strong> {detailOrganization.contract_id}</p>
                    <p><strong>Country Code:</strong> {detailOrganization.country_code}</p>
                    <p><strong>City:</strong> {detailOrganization.city}</p>
                    <p><strong>Address:</strong> {detailOrganization.address}</p>
                    <p><strong>Phone:</strong> {detailOrganization.phone}</p>
                    <p><strong>Email:</strong> {detailOrganization.email}</p>
                    <p><strong>Website:</strong> {detailOrganization.website}</p>
                    <button onClick={() => setDetailOrganization(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default OrganizationList;
