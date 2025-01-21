import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключение Bootstrap
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from '../store/departmentSlice';

const DepartmentList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.departments);

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
                .catch((err) => alert('Невозможно удалить запись: ' + err));
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

    if (loading) {
        return <div className="alert alert-info">Загрузка...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Ошибка: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Список отделов</h2>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Добавить отдел
            </button>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Название отдела</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((dept) => (
                            <tr key={dept.department_id}>
                                <td>{dept.department_id}</td>
                                <td>{dept.department_name}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => handleEdit(dept)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mr-2"
                                        onClick={() => handleDelete(dept.department_id)}
                                    >
                                        Удалить
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => setDetailDepartment(dept)}
                                    >
                                        Подробнее
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">
                            {editingDepartment ? 'Редактировать отдел' : 'Добавить отдел'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Название отдела:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.department_name}
                                    onChange={(e) =>
                                        setFormData({ department_name: e.target.value })
                                    }
                                />
                                {formErrors.department_name && (
                                    <small className="text-danger">
                                        {formErrors.department_name}
                                    </small>
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

            {/* Подробная информация об отделе */}
            {detailDepartment && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="card-title">Детали отдела</h3>
                        <p>
                            <strong>ID:</strong> {detailDepartment.department_id}
                        </p>
                        <p>
                            <strong>Название отдела:</strong> {detailDepartment.department_name}
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setDetailDepartment(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;
