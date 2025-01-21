import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем стили Bootstrap
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import {
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
} from '../store/contractSlice';

const ContractList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.contracts);

    const [employees, setEmployees] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [detailContract, setDetailContract] = useState(null);
    const [formData, setFormData] = useState({
        organization_name: '',
        date_conclusion: '',
        employee_id: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchContracts({ page: 1, limit: 10 }));

        axiosInstance.get('/employees')
            .then(response => setEmployees(response.data.data || response.data))
            .catch(err => console.error('Ошибка при загрузке сотрудников:', err));
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
            employee_id: '',
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (contract) => {
        setEditingContract(contract);
        setFormData({
            organization_name: contract.organization_name || '',
            date_conclusion: contract.date_conclusion ? contract.date_conclusion.split('T')[0] : '',
            employee_id: contract.employee_id || '',
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

    if (loading) return <div className="alert alert-info">Загрузка...</div>;
    if (error) return <div className="alert alert-danger">Ошибка: {error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Список договоров</h2>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Добавить договор
            </button>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
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
                                        <button
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => handleEdit(contract)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm mr-2"
                                            onClick={() => handleDelete(contract.contract_id)}
                                        >
                                            Удалить
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => setDetailContract(contract)}
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

            {/* Форма добавления/редактирования */}
            {showForm && (
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">
                            {editingContract ? 'Редактировать договор' : 'Добавить договор'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Организация:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.organization_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, organization_name: e.target.value })
                                    }
                                />
                                {formErrors.organization_name && (
                                    <small className="text-danger">{formErrors.organization_name}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Дата заключения:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.date_conclusion}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date_conclusion: e.target.value })
                                    }
                                />
                                {formErrors.date_conclusion && (
                                    <small className="text-danger">{formErrors.date_conclusion}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Сотрудник:</label>
                                <select
                                    className="form-control"
                                    value={formData.employee_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, employee_id: e.target.value })
                                    }
                                >
                                    <option value="">Выберите сотрудника</option>
                                    {employees.map(emp => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.employee_id && (
                                    <small className="text-danger">{formErrors.employee_id}</small>
                                )}
                            </div>
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

            {/* Подробная информация о договоре */}
            {detailContract && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="card-title">Детали договора</h3>
                        <p>
                            <strong>ID:</strong> {detailContract.contract_id}
                        </p>
                        <p>
                            <strong>Организация:</strong> {detailContract.organization_name}
                        </p>
                        <p>
                            <strong>Дата заключения:</strong>{' '}
                            {new Date(detailContract.date_conclusion).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Сотрудник ID:</strong> {detailContract.employee_id}
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setDetailContract(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractList;
