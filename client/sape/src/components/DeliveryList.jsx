import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем стили Bootstrap
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import {
    fetchDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
} from '../store/deliverySlice';

// ----- Импорты для экспорта -----
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

const DeliveryList = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.deliveries);

    const [employees, setEmployees] = useState([]);
    const [contracts, setContracts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState(null);
    const [detailDelivery, setDetailDelivery] = useState(null);
    const [formData, setFormData] = useState({
        contract_id: '',
        equipment_type: '',
        user_comment: '',
        employee_id: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Подгружаем список поставок (с пагинацией)
        dispatch(fetchDeliveries({ page: 1, limit: 10 }));

        // Подгружаем список сотрудников
        axiosInstance.get('/employees')
            .then(response => setEmployees(response.data.data || response.data))
            .catch(err => console.error('Ошибка при загрузке сотрудников:', err));

        // Подгружаем список договоров
        axiosInstance.get('/contracts')
            .then(response => setContracts(response.data.data || response.data))
            .catch(err => console.error('Ошибка при загрузке договоров:', err));
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!formData.contract_id) errors.contract_id = 'Договор обязателен';
        if (!formData.equipment_type) errors.equipment_type = 'Тип оборудования обязателен';
        return errors;
    };

    const handleAdd = () => {
        setEditingDelivery(null);
        setFormData({
            contract_id: '',
            equipment_type: '',
            user_comment: '',
            employee_id: '',
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
            employee_id: delivery.employee_id || '',
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
            // Обновляем существующую поставку
            dispatch(updateDelivery({ contract_id: editingDelivery.contract_id, ...formData }));
        } else {
            // Создаём новую поставку
            dispatch(createDelivery(formData));
        }
        setShowForm(false);
    };

    // -------------------------------------------------------------------------
    //  Экспорт в Excel (используем библиотеку xlsx)
    // -------------------------------------------------------------------------
    const handleExportToExcel = () => {
        try {
            // Преобразуем данные списка поставок в удобный формат
            const dataForExcel = list.map((delivery) => {
                const contract = contracts.find(c => c.contract_id === delivery.contract_id);
                const employee = employees.find(e => e.employee_id === delivery.employee_id);

                return {
                    'Contract ID': delivery.contract_id,
                    'Организация': contract ? contract.organization_name : '-',
                    'Тип оборудования': delivery.equipment_type,
                    'Комментарий': delivery.user_comment || '-',
                    'Сотрудник': employee
                        ? `${employee.full_name} (ID: ${employee.employee_id})`
                        : delivery.employee_id || '-',
                };
            });

            // Создаём worksheet из массива объектов
            const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
            // Создаём новую рабочую книгу
            const workbook = XLSX.utils.book_new();
            // Добавляем worksheet в книгу
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Поставки');

            // Сохраняем файл
            XLSX.writeFile(workbook, 'deliveries.xlsx');
        } catch (err) {
            alert('Ошибка при выгрузке в Excel: ' + err);
        }
    };

    // -------------------------------------------------------------------------
    //  Экспорт в Word (используем библиотеку docx)
    // -------------------------------------------------------------------------
    const handleExportToWord = async () => {
        try {
            // Заголовок
            const titleParagraph = new Paragraph({
                children: [
                    new TextRun({
                        text: 'Список поставок',
                        bold: true,
                        size: 28, // 14pt в docx (размер указывается в half-points, поэтому 28)
                    }),
                ],
            });

            // Шапка таблицы
            const tableHeader = new TableRow({
                children: [
                    new TableCell({
                        width: { size: 2000, type: WidthType.DXA },
                        children: [new Paragraph('Contract ID')],
                    }),
                    new TableCell({
                        width: { size: 4000, type: WidthType.DXA },
                        children: [new Paragraph('Организация')],
                    }),
                    new TableCell({
                        width: { size: 3000, type: WidthType.DXA },
                        children: [new Paragraph('Тип оборудования')],
                    }),
                    new TableCell({
                        width: { size: 3000, type: WidthType.DXA },
                        children: [new Paragraph('Комментарий')],
                    }),
                    new TableCell({
                        width: { size: 4000, type: WidthType.DXA },
                        children: [new Paragraph('Сотрудник')],
                    }),
                ],
            });

            // Генерируем строки таблицы
            const tableRows = [tableHeader];

            list.forEach((delivery) => {
                const contract = contracts.find(c => c.contract_id === delivery.contract_id);
                const employee = employees.find(e => e.employee_id === delivery.employee_id);

                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(String(delivery.contract_id))],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph(contract ? contract.organization_name : '-'),
                                ],
                            }),
                            new TableCell({
                                children: [new Paragraph(delivery.equipment_type || '')],
                            }),
                            new TableCell({
                                children: [new Paragraph(delivery.user_comment || '-')],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph(
                                        employee
                                            ? `${employee.full_name} (ID: ${employee.employee_id})`
                                            : delivery.employee_id || '-'
                                    ),
                                ],
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

            // Создаём документ, сразу передаём массив секций
            const doc = new Document({
                creator: 'My App',
                title: 'Список поставок',
                sections: [
                    {
                        children: [titleParagraph, table],
                    },
                ],
            });

            // Генерируем Blob и скачиваем файл
            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'deliveries.docx');
        } catch (err) {
            alert('Ошибка при выгрузке в Word: ' + err);
        }
    };

    // -- Рендер компонента --
    if (loading) return <div className="alert alert-info">Загрузка...</div>;
    if (error) return <div className="alert alert-danger">Ошибка: {error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Список поставок</h2>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Добавить поставку
            </button>

            {/* Кнопки экспорта */}
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
                            <th>Contract ID</th>
                            <th>Организация</th>
                            <th>Тип оборудования</th>
                            <th>Комментарий</th>
                            <th>Сотрудник</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((delivery) => {
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
                                        <button
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => handleEdit(delivery)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm mr-2"
                                            onClick={() => handleDelete(delivery.contract_id)}
                                        >
                                            Удалить
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => setDetailDelivery(delivery)}
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
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="card-title">
                            {editingDelivery ? 'Редактировать поставку' : 'Добавить поставку'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Договор:</label>
                                <select
                                    className="form-control"
                                    value={formData.contract_id}
                                    onChange={e =>
                                        setFormData({ ...formData, contract_id: e.target.value })
                                    }
                                >
                                    <option value="">Выберите договор</option>
                                    {contracts.map(contract => (
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

                            <div className="form-group">
                                <label>Тип оборудования:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.equipment_type}
                                    onChange={e =>
                                        setFormData({ ...formData, equipment_type: e.target.value })
                                    }
                                />
                                {formErrors.equipment_type && (
                                    <small className="text-danger">{formErrors.equipment_type}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Комментарий:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.user_comment}
                                    onChange={e =>
                                        setFormData({ ...formData, user_comment: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Сотрудник:</label>
                                <select
                                    className="form-control"
                                    value={formData.employee_id}
                                    onChange={e =>
                                        setFormData({ ...formData, employee_id: e.target.value })
                                    }
                                >
                                    <option value="">Выберите сотрудника</option>
                                    {employees.map(emp => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name} (ID: {emp.employee_id})
                                        </option>
                                    ))}
                                </select>
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

            {/* Подробная информация о поставке */}
            {detailDelivery && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="card-title">Детали поставки</h3>
                        <p>
                            <strong>Contract ID:</strong> {detailDelivery.contract_id}
                        </p>
                        <p>
                            <strong>Тип оборудования:</strong> {detailDelivery.equipment_type}
                        </p>
                        <p>
                            <strong>Комментарий:</strong> {detailDelivery.user_comment}
                        </p>
                        <p>
                            <strong>ID сотрудника:</strong> {detailDelivery.employee_id}
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setDetailDelivery(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryList;
