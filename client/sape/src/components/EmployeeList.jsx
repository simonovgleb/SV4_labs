import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../api/axiosInstance';
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from '../store/employeeSlice';

// ----- Новые импорты для экспорта -----
import * as XLSX from 'xlsx';           // библиотека для Excel
import { saveAs } from 'file-saver';    // для сохранения файла (Word/Excel)
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    TextRun
} from 'docx';                          // библиотека для Word

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.employees);

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
        photo: null,
    });
    const [formErrors, setFormErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 10 }));

        axiosInstance
            .get('/departments')
            .then((response) => {
                setDepartments(response.data.data || response.data);
            })
            .catch((err) => {
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
            photo: null,
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
            photo: null,
        });
        setPhotoPreview(employee.photo || null);
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            dispatch(deleteEmployee(id))
                .unwrap()
                .catch((err) => alert('Невозможно удалить запись: ' + err));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, photo: null }));
            setPhotoPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

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

    // -------------------------------------------------------------------------
    //  Функция экспорта в Excel (используем библиотеку xlsx)
    // -------------------------------------------------------------------------
    const handleExportToExcel = () => {
        try {
            // Преобразуем данные списка сотрудников в формат, удобный для xlsx
            const dataForExcel = list.map((emp) => ({
                ID: emp.employee_id,
                ФИО: emp.full_name,
                Должность: emp.position,
                Зарплата: emp.salary,
                Премия: emp.bonus,
                Месяц: emp.month,
                Отдел: emp.Department?.department_name || '',
            }));

            // Создаём worksheet из массива объектов
            const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
            // Создаём новую рабочую книгу
            const workbook = XLSX.utils.book_new();
            // Добавляем worksheet в книгу
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Сотрудники');

            // Сохраняем файл (пользователю будет предложено скачать)
            XLSX.writeFile(workbook, 'employees.xlsx');
        } catch (err) {
            alert('Ошибка при выгрузке в Excel: ' + err);
        }
    };

    // -------------------------------------------------------------------------
    //  Функция экспорта в Word (используем библиотеку docx)
    // -------------------------------------------------------------------------
    const handleExportToWord = async () => {
        try {
            // Заголовок параграфа
            const titleParagraph = new Paragraph({
                children: [
                    new TextRun({
                        text: 'Список сотрудников',
                        bold: true,
                        size: 28, // 14pt (в docx это *2)
                    }),
                ],
            });

            // Генерируем строки таблицы
            const tableRows = [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 2000, type: WidthType.DXA },
                            children: [new Paragraph('ID')],
                        }),
                        new TableCell({
                            width: { size: 5000, type: WidthType.DXA },
                            children: [new Paragraph('ФИО')],
                        }),
                        new TableCell({
                            width: { size: 3000, type: WidthType.DXA },
                            children: [new Paragraph('Должность')],
                        }),
                        new TableCell({
                            width: { size: 2000, type: WidthType.DXA },
                            children: [new Paragraph('Зарплата')],
                        }),
                        new TableCell({
                            width: { size: 2000, type: WidthType.DXA },
                            children: [new Paragraph('Премия')],
                        }),
                        new TableCell({
                            width: { size: 2000, type: WidthType.DXA },
                            children: [new Paragraph('Месяц')],
                        }),
                        new TableCell({
                            width: { size: 3000, type: WidthType.DXA },
                            children: [new Paragraph('Отдел')],
                        }),
                    ],
                }),
            ];

            // Заполняем таблицу данными сотрудников
            list.forEach((emp) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(String(emp.employee_id))],
                            }),
                            new TableCell({
                                children: [new Paragraph(emp.full_name || '')],
                            }),
                            new TableCell({
                                children: [new Paragraph(emp.position || '')],
                            }),
                            new TableCell({
                                children: [new Paragraph(String(emp.salary || ''))],
                            }),
                            new TableCell({
                                children: [new Paragraph(String(emp.bonus || ''))],
                            }),
                            new TableCell({
                                children: [new Paragraph(emp.month || '')],
                            }),
                            new TableCell({
                                children: [new Paragraph(emp.Department?.department_name || '')],
                            }),
                        ],
                    })
                );
            });

            // Создаём таблицу
            const table = new Table({
                rows: tableRows,
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
            });

            // Создаём документ, сразу передаём секции
            const doc = new Document({
                creator: 'My App',
                title: 'Список сотрудников',
                sections: [
                    {
                        children: [titleParagraph, table],
                    },
                ],
            });

            // Формируем Blob и скачиваем файл
            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'employees.docx');
        } catch (err) {
            alert('Ошибка при выгрузке в Word: ' + err);
        }
    };

    if (loading) {
        return <div className="alert alert-info">Загрузка...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Ошибка: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Список сотрудников</h2>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Добавить сотрудника
            </button>

            {/* Кнопки выгрузки */}
            <div className="mb-3">
                <button className="btn btn-success mr-2" onClick={handleExportToExcel}>
                    Выгрузить в Excel
                </button>
                <button className="btn btn-success" onClick={handleExportToWord}>
                    Выгрузить в Word
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
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
                        {list.map((emp) => (
                            <tr key={emp.employee_id}>
                                <td>{emp.employee_id}</td>
                                <td>{emp.full_name}</td>
                                <td>{emp.position}</td>
                                <td>{emp.salary}</td>
                                <td>{emp.month}</td>
                                <td>
                                    {emp.photo && <img src={emp.photo} alt={emp.full_name} width="50" />}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => handleEdit(emp)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mr-2"
                                        onClick={() => handleDelete(emp.employee_id)}
                                    >
                                        Удалить
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => setDetailEmployee(emp)}
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
                            {editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Поля формы */}
                            {[
                                { label: 'ФИО', name: 'full_name', type: 'text' },
                                { label: 'Должность', name: 'position', type: 'text' },
                                { label: 'Зарплата', name: 'salary', type: 'number' },
                                { label: 'Премия', name: 'bonus', type: 'number' },
                                { label: 'Месяц', name: 'month', type: 'text' },
                            ].map(({ label, name, type }) => (
                                <div className="form-group" key={name}>
                                    <label>{label}:</label>
                                    <input
                                        className="form-control"
                                        type={type}
                                        value={formData[name]}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [name]: e.target.value })
                                        }
                                    />
                                    {formErrors[name] && (
                                        <small className="text-danger">{formErrors[name]}</small>
                                    )}
                                </div>
                            ))}

                            <div className="form-group">
                                <label>Отдел:</label>
                                <select
                                    className="form-control"
                                    value={formData.department_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, department_id: e.target.value })
                                    }
                                >
                                    <option value="">Выберите отдел</option>
                                    {departments.map((dept) => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Фотография:</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                                {photoPreview && (
                                    <div className="mt-2">
                                        <img src={photoPreview} alt="Preview" width="100" />
                                    </div>
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

            {/* Подробная информация о выбранном сотруднике */}
            {detailEmployee && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h3>Детали сотрудника</h3>
                        {[
                            { label: 'ID', value: detailEmployee.employee_id },
                            { label: 'ФИО', value: detailEmployee.full_name },
                            { label: 'Должность', value: detailEmployee.position },
                            { label: 'Зарплата', value: detailEmployee.salary },
                            { label: 'Премия', value: detailEmployee.bonus },
                            { label: 'Месяц', value: detailEmployee.month },
                            {
                                label: 'Отдел',
                                value:
                                    detailEmployee.Department?.department_name || 'Не указан',
                            },
                        ].map(({ label, value }) => (
                            <p key={label}>
                                <strong>{label}:</strong> {value}
                            </p>
                        ))}
                        {detailEmployee.photo && (
                            <img
                                src={`http://localhost:5000${detailEmployee.photo}`}
                                alt={detailEmployee.full_name}
                                width="100"
                            />
                        )}
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setDetailEmployee(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
