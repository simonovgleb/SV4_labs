const { Op } = require('sequelize');
const { Employee, Department } = require('../models/models');

class EmployeeController {
    // 1) Создание новой записи
    async create(req, res) {
        try {
            const { department_id, full_name, position, salary, bonus, month } = req.body;

            // Проверка обязательных полей
            if (!full_name || !position || !salary || !month) {
                return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
            }

            const employee = await Employee.create({
                department_id,
                full_name,
                position,
                salary,
                bonus,
                month,
            });

            return res.status(201).json(employee);
        } catch (error) {
            console.error('Ошибка при создании сотрудника:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 2-5) Получение списка записей с поддержкой пагинации, сортировки, фильтрации и поиска
    async findAll(req, res) {
        try {
            let {
                page = 1,
                limit = 10,
                sortBy = 'employee_id',
                sortOrder = 'ASC',
                search = '',
                department_id,
                position,
                month,
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            // Формирование условий поиска и фильтрации
            const where = {};

            // Поиск по полям full_name и position
            if (search) {
                where[Op.or] = [
                    { full_name: { [Op.iLike]: `%${search}%` } },
                    { position: { [Op.iLike]: `%${search}%` } }
                ];
            }

            // Дополнительная фильтрация
            if (department_id) {
                where.department_id = department_id;
            }
            if (position) {
                where.position = position;
            }
            if (month) {
                where.month = month;
            }

            const result = await Employee.findAndCountAll({
                where,
                limit,
                offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
                include: [{ model: Department }], // подключение модели Department при необходимости
            });

            return res.json({
                data: result.rows,
                total: result.count,
                page,
                totalPages: Math.ceil(result.count / limit),
            });
        } catch (error) {
            console.error('Ошибка при получении списка сотрудников:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 6) Получение детальной информации по ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee.findByPk(id, {
                include: [{ model: Department }],
            });

            if (!employee) {
                // 7) Обработка случая отсутствия записи
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }

            return res.json(employee);
        } catch (error) {
            console.error('Ошибка при получении сотрудника:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 8) Обновление записи
    async update(req, res) {
        try {
            const { id } = req.params;
            const { department_id, full_name, position, salary, bonus, month } = req.body;

            const employee = await Employee.findByPk(id);
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }

            // Обновление полей
            employee.department_id = department_id !== undefined ? department_id : employee.department_id;
            employee.full_name = full_name || employee.full_name;
            employee.position = position || employee.position;
            employee.salary = salary !== undefined ? salary : employee.salary;
            employee.bonus = bonus !== undefined ? bonus : employee.bonus;
            employee.month = month || employee.month;

            await employee.save();

            return res.json(employee);
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 9) Удаление записи
    async delete(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }

            await employee.destroy();
            return res.status(200).json({ message: 'Сотрудник успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 10) Проверка существования записи
    async exists(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee.findByPk(id);
            return res.json({ exists: !!employee });
        } catch (error) {
            console.error('Ошибка при проверке существования сотрудника:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new EmployeeController();