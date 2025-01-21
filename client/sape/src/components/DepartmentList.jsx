import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../store/departmentSlice';

const DepartmentList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(state => state.departments);

    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [detailDepartment, setDetailDepartment] = useState(null);
    const [formData, setFormData] = useState({ department_name: '' });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchDepartments({ page: 1, limit: 10 }));
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!formData.department_name) {
            errors.department_name = 'Название отдела обязательно';
        }
        return errors;
    };

    const handleAdd = () => {
        setEditingDepartment(null);
        setFormData({ department_name: '' });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setFormData({ department_name: department.department_name });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отдел?')) {
            dispatch(deleteDepartment(id))
                .unwrap()
                .catch(err => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (editingDepartment) {
            dispatch(updateDepartment({ id: editingDepartment.department_id, ...formData }));
        } else {
            dispatch(createDepartment(formData));
        }
        setShowForm(false);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Список отделов</h2>
            <button onClick={handleAdd}>Добавить отдел</button>
            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название отдела</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(dept => (
                        <tr key={dept.department_id}>
                            <td>{dept.department_id}</td>
                            <td>{dept.department_name}</td>
                            <td>
                                <button onClick={() => handleEdit(dept)}>Редактировать</button>
                                <button onClick={() => handleDelete(dept.department_id)}>Удалить</button>
                                <button onClick={() => setDetailDepartment(dept)}>Подробнее</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h3>{editingDepartment ? 'Редактировать отдел' : 'Добавить отдел'}</h3>
                    <div>
                        <label>Название отдела:</label>
                        <input
                            type="text"
                            value={formData.department_name}
                            onChange={e => setFormData({ department_name: e.target.value })}
                        />
                        {formErrors.department_name && (
                            <span style={{ color: 'red' }}>{formErrors.department_name}</span>
                        )}
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </form>
            )}

            {/* Подробная информация об отделе */}
            {detailDepartment && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <h3>Детали отдела</h3>
                    <p><strong>ID:</strong> {detailDepartment.department_id}</p>
                    <p><strong>Название отдела:</strong> {detailDepartment.department_name}</p>
                    <button onClick={() => setDetailDepartment(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;