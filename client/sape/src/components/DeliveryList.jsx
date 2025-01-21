import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import {
    fetchDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery
} from '../store/deliverySlice';

const DeliveryList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(state => state.deliveries);

    // Состояния для сотрудников и договоров
    const [employees, setEmployees] = useState([]);
    const [contracts, setContracts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState(null);
    const [detailDelivery, setDetailDelivery] = useState(null);
    const [formData, setFormData] = useState({
        contract_id: '',
        equipment_type: '',
        user_comment: '',
        employee_id: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchDeliveries({ page: 1, limit: 10 }));

        axiosInstance.get('/employees')
            .then(response => {
                setEmployees(response.data.data || response.data);
            })
            .catch(err => console.error('Ошибка при загрузке сотрудников:', err));

        axiosInstance.get('/contracts')
            .then(response => {
                setContracts(response.data.data || response.data);
            })
            .catch(err => console.error('Ошибка при загрузке договоров:', err));
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!formData.contract_id) errors.contract_id = 'Contract ID обязателен';
        if (!formData.equipment_type) errors.equipment_type = 'Тип оборудования обязателен';
        return errors;
    };

    const handleAdd = () => {
        setEditingDelivery(null);
        setFormData({
            contract_id: '',
            equipment_type: '',
            user_comment: '',
            employee_id: ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (delivery) => {
        setEditingDelivery(delivery);
        setFormData({
            contract_id: delivery.contract_id || '',
            equipment_type: delivery.equipment_type || '',
            user_comment: delivery.user_comment || '',
            employee_id: delivery.employee_id || ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (contract_id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту поставку?')) {
            dispatch(deleteDelivery(contract_id))
                .unwrap()
                .catch(err => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (editingDelivery) {
            dispatch(updateDelivery({ contract_id: editingDelivery.contract_id, ...formData }));
        } else {
            dispatch(createDelivery(formData));
        }
        setShowForm(false);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Список поставок</h2>
            <button onClick={handleAdd}>Добавить поставку</button>
            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Contract ID</th>
                        <th>Организация</th>
                        <th>Тип оборудования</th>
                        <th>Комментарий</th>
                        <th>Сотрудник</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(delivery => {
                        const contract = contracts.find(c => c.contract_id === delivery.contract_id);
                        const employee = employees.find(e => e.employee_id === delivery.employee_id);
                        return (
                            <tr key={delivery.contract_id}>
                                <td>{delivery.contract_id}</td>
                                <td>{contract ? contract.organization_name : '-'}</td>
                                <td>{delivery.equipment_type}</td>
                                <td>{delivery.user_comment || '-'}</td>
                                <td>
                                    {employee 
                                        ? `${employee.full_name} (ID: ${employee.employee_id})`
                                        : delivery.employee_id || '-'}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(delivery)}>Редактировать</button>
                                    <button onClick={() => handleDelete(delivery.contract_id)}>Удалить</button>
                                    <button onClick={() => setDetailDelivery(delivery)}>Подробнее</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h3>{editingDelivery ? 'Редактировать поставку' : 'Добавить поставку'}</h3>
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
                        <label>Тип оборудования:</label>
                        <input
                            type="text"
                            value={formData.equipment_type}
                            onChange={e => setFormData({ ...formData, equipment_type: e.target.value })}
                        />
                        {formErrors.equipment_type && <span style={{ color: 'red' }}>{formErrors.equipment_type}</span>}
                    </div>
                    <div>
                        <label>Комментарий:</label>
                        <input
                            type="text"
                            value={formData.user_comment}
                            onChange={e => setFormData({ ...formData, user_comment: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Сотрудник:</label>
                        <select
                            value={formData.employee_id}
                            onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                        >
                            <option value="">Выберите сотрудника</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} (ID: {emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </form>
            )}

            {/* Подробная информация о поставке */}
            {detailDelivery && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <h3>Детали поставки</h3>
                    <p><strong>Contract ID:</strong> {detailDelivery.contract_id}</p>
                    <p><strong>Тип оборудования:</strong> {detailDelivery.equipment_type}</p>
                    <p><strong>Комментарий:</strong> {detailDelivery.user_comment}</p>
                    <p><strong>ID сотрудника:</strong> {detailDelivery.employee_id}</p>
                    <button onClick={() => setDetailDelivery(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default DeliveryList;
