import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../store/employeeSlice';

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(state => state.employees);

    // Состояние для списка отделов
    const [departments, setDepartments] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [detailEmployee, setDetailEmployee] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        position: '',
        salary: '',
        bonus: '',
        month: '',
        department_id: '',
        photo: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 10 }));

        // Загрузка списка отделов
        axiosInstance.get('/departments')
            .then(response => {
                // предполагаем, что данные приходят в свойстве data
                setDepartments(response.data.data || response.data);
            })
            .catch(err => {
                console.error('Ошибка при загрузке отделов:', err);
            });
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!formData.full_name) errors.full_name = 'Имя обязательно';
        if (!formData.position) errors.position = 'Должность обязательна';
        if (!formData.salary) errors.salary = 'Зарплата обязательна';
        if (!formData.month) errors.month = 'Месяц обязателен';
        return errors;
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({
            full_name: '',
            position: '',
            salary: '',
            bonus: '',
            month: '',
            department_id: '',
            photo: null
        });
        setFormErrors({});
        setPhotoPreview(null);
        setShowForm(true);
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            full_name: employee.full_name || '',
            position: employee.position || '',
            salary: employee.salary || '',
            bonus: employee.bonus || '',
            month: employee.month || '',
            department_id: employee.department_id || '',
            photo: null
        });
        setPhotoPreview(employee.photo || null);
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            dispatch(deleteEmployee(id))
                .unwrap()
                .catch(err => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, photo: null }));
            setPhotoPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // Создаем FormData для отправки на сервер
        const submissionData = new FormData();
        submissionData.append('full_name', formData.full_name);
        submissionData.append('position', formData.position);
        submissionData.append('salary', formData.salary);
        submissionData.append('bonus', formData.bonus);
        submissionData.append('month', formData.month);
        submissionData.append('department_id', formData.department_id);
        if (formData.photo) {
            submissionData.append('photo', formData.photo);
        }

        if (editingEmployee) {
            dispatch(updateEmployee({ id: editingEmployee.employee_id, data: submissionData }));
        } else {
            dispatch(createEmployee(submissionData));
        }

        setShowForm(false);
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Список сотрудников</h2>
            <button onClick={handleAdd}>Добавить сотрудника</button>
            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Должность</th>
                        <th>Зарплата</th>
                        <th>Месяц</th>
                        <th>Фото</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(emp => (
                        <tr key={emp.employee_id}>
                            <td>{emp.employee_id}</td>
                            <td>{emp.full_name}</td>
                            <td>{emp.position}</td>
                            <td>{emp.salary}</td>
                            <td>{emp.month}</td>
                            <td>
                                {emp.photo && (
                                    <img src={emp.photo} alt={emp.full_name} width="50" />
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(emp)}>Редактировать</button>
                                <button onClick={() => handleDelete(emp.employee_id)}>Удалить</button>
                                <button onClick={() => setDetailEmployee(emp)}>Подробнее</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h3>{editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h3>
                    <div>
                        <label>ФИО:</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                        {formErrors.full_name && <span style={{ color: 'red' }}>{formErrors.full_name}</span>}
                    </div>
                    <div>
                        <label>Должность:</label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                        />
                        {formErrors.position && <span style={{ color: 'red' }}>{formErrors.position}</span>}
                    </div>
                    <div>
                        <label>Зарплата:</label>
                        <input
                            type="number"
                            value={formData.salary}
                            onChange={e => setFormData({ ...formData, salary: e.target.value })}
                        />
                        {formErrors.salary && <span style={{ color: 'red' }}>{formErrors.salary}</span>}
                    </div>
                    <div>
                        <label>Премия:</label>
                        <input
                            type="number"
                            value={formData.bonus}
                            onChange={e => setFormData({ ...formData, bonus: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Месяц:</label>
                        <input
                            type="text"
                            value={formData.month}
                            onChange={e => setFormData({ ...formData, month: e.target.value })}
                        />
                        {formErrors.month && <span style={{ color: 'red' }}>{formErrors.month}</span>}
                    </div>
                    <div>
                        <label>Отдел:</label>
                        <select
                            value={formData.department_id}
                            onChange={e => setFormData({ ...formData, department_id: e.target.value })}
                        >
                            <option value="">Выберите отдел</option>
                            {departments.map(dept => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Фотография:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        {photoPreview && (
                            <div>
                                <img src={photoPreview} alt="Preview" width="100" />
                            </div>
                        )}
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </form>
            )}

            {/* Подробная информация о сотруднике */}
            {detailEmployee && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <h3>Детали сотрудника</h3>
                    <p><strong>ID:</strong> {detailEmployee.employee_id}</p>
                    <p><strong>ФИО:</strong> {detailEmployee.full_name}</p>
                    <p><strong>Должность:</strong> {detailEmployee.position}</p>
                    <p><strong>Зарплата:</strong> {detailEmployee.salary}</p>
                    <p><strong>Премия:</strong> {detailEmployee.bonus}</p>
                    <p><strong>Месяц:</strong> {detailEmployee.month}</p>
                    <p>
                        <strong>Отдел:</strong> {detailEmployee.Department ? detailEmployee.Department.department_name : 'Не указан'}
                    </p>
                    {detailEmployee.photo && (
                        <div>
                            <img src={`http://localhost:5000${detailEmployee.photo}`} alt={detailEmployee.full_name} width="100" />
                        </div>
                    )}
                    <button onClick={() => setDetailEmployee(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
