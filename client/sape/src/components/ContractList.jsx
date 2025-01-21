import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';  // Для загрузки сотрудников
import {
    fetchContracts,
    createContract,
    updateContract,
    deleteContract
} from '../store/contractSlice';

const ContractList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(state => state.contracts);

    // Состояние для сотрудников
    const [employees, setEmployees] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [detailContract, setDetailContract] = useState(null);
    const [formData, setFormData] = useState({
        organization_name: '',
        date_conclusion: '',
        employee_id: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchContracts({ page: 1, limit: 10 }));

        // Загрузка списка сотрудников
        axiosInstance.get('/employees')
            .then(response => {
                setEmployees(response.data.data || response.data);
            })
            .catch(err => {
                console.error('Ошибка при загрузке сотрудников:', err);
            });
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!formData.organization_name) errors.organization_name = 'Наименование организации обязательно';
        if (!formData.date_conclusion) errors.date_conclusion = 'Дата заключения обязательна';
        if (!formData.employee_id) errors.employee_id = 'Сотрудник обязателен';
        return errors;
    };

    const handleAdd = () => {
        setEditingContract(null);
        setFormData({
            organization_name: '',
            date_conclusion: '',
            employee_id: ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (contract) => {
        setEditingContract(contract);
        setFormData({
            organization_name: contract.organization_name || '',
            date_conclusion: contract.date_conclusion ? contract.date_conclusion.split('T')[0] : '',
            employee_id: contract.employee_id || ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот договор?')) {
            dispatch(deleteContract(id))
                .unwrap()
                .catch(err => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (editingContract) {
            dispatch(updateContract({ id: editingContract.contract_id, ...formData }));
        } else {
            dispatch(createContract(formData));
        }
        setShowForm(false);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Список договоров</h2>
            <button onClick={handleAdd}>Добавить договор</button>
            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Организация</th>
                        <th>Дата заключения</th>
                        <th>Сотрудник</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(contract => {
                        const employee = employees.find(emp => emp.employee_id === contract.employee_id);
                        return (
                            <tr key={contract.contract_id}>
                                <td>{contract.contract_id}</td>
                                <td>{contract.organization_name}</td>
                                <td>{new Date(contract.date_conclusion).toLocaleDateString()}</td>
                                <td>
                                    {contract.employee_id}
                                    {employee ? ` (${employee.full_name})` : ''}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(contract)}>Редактировать</button>
                                    <button onClick={() => handleDelete(contract.contract_id)}>Удалить</button>
                                    <button onClick={() => setDetailContract(contract)}>Подробнее</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h3>{editingContract ? 'Редактировать договор' : 'Добавить договор'}</h3>
                    <div>
                        <label>Организация:</label>
                        <input
                            type="text"
                            value={formData.organization_name}
                            onChange={e => setFormData({ ...formData, organization_name: e.target.value })}
                        />
                        {formErrors.organization_name && <span style={{ color: 'red' }}>{formErrors.organization_name}</span>}
                    </div>
                    <div>
                        <label>Дата заключения:</label>
                        <input
                            type="date"
                            value={formData.date_conclusion}
                            onChange={e => setFormData({ ...formData, date_conclusion: e.target.value })}
                        />
                        {formErrors.date_conclusion && <span style={{ color: 'red' }}>{formErrors.date_conclusion}</span>}
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
                                    {emp.full_name}
                                </option>
                            ))}
                        </select>
                        {formErrors.employee_id && <span style={{ color: 'red' }}>{formErrors.employee_id}</span>}
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </form>
            )}

            {/* Подробная информация о договоре */}
            {detailContract && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <h3>Детали договора</h3>
                    <p><strong>ID:</strong> {detailContract.contract_id}</p>
                    <p><strong>Организация:</strong> {detailContract.organization_name}</p>
                    <p><strong>Дата заключения:</strong> {new Date(detailContract.date_conclusion).toLocaleDateString()}</p>
                    <p><strong>Сотрудник ID:</strong> {detailContract.employee_id}</p>
                    <button onClick={() => setDetailContract(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default ContractList;
