const { Op } = require('sequelize');
const { Department } = require('../models/models');

class DepartmentController {
    // 1) Создание новой записи
    async create(req, res) {
        try {
            const { department_name } = req.body;
            if (!department_name) {
                return res.status(400).json({ message: 'Имя отдела обязательно для заполнения' });
            }

            const department = await Department.create({ department_name });
            return res.status(201).json(department);
        } catch (error) {
            console.error('Ошибка при создании отдела:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 2-5) Получение списка записей с поддержкой пагинации, сортировки, фильтрации и поиска
    async findAll(req, res) {
        try {
            // Извлечение параметров запроса
            let {
                page = 1,
                limit = 10,
                sortBy = 'department_id',
                sortOrder = 'ASC',
                search = '',
                department_name // пример фильтрации по имени отдела
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            // Формирование условий фильтрации
            const where = {};
            if (search) {
                // Поиск по нескольким полям, например только по department_name (можно расширить при необходимости)
                where.department_name = { [Op.iLike]: `%${search}%` };
            }
            // Дополнительная фильтрация по отдельным полям
            if (department_name) {
                where.department_name = department_name;
            }

            const result = await Department.findAndCountAll({
                where,
                limit,
                offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
            });

            return res.json({
                data: result.rows,
                total: result.count,
                page,
                totalPages: Math.ceil(result.count / limit),
            });
        } catch (error) {
            console.error('Ошибка при получении списка отделов:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 6) Получение детальной информации по ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const department = await Department.findByPk(id);

            if (!department) {
                // 7) Обработка случая отсутствия записи
                return res.status(404).json({ message: 'Отдел не найден' });
            }

            return res.json(department);
        } catch (error) {
            console.error('Ошибка при получении отдела:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 8) Обновление записи
    async update(req, res) {
        try {
            const { id } = req.params;
            const { department_name } = req.body;

            const department = await Department.findByPk(id);
            if (!department) {
                return res.status(404).json({ message: 'Отдел не найден' });
            }

            // Обновление полей (в данном случае только department_name)
            department.department_name = department_name || department.department_name;
            await department.save();

            return res.json(department);
        } catch (error) {
            console.error('Ошибка при обновлении отдела:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 9) Удаление записи
    async delete(req, res) {
        try {
            const { id } = req.params;
            const department = await Department.findByPk(id);
            if (!department) {
                return res.status(404).json({ message: 'Отдел не найден' });
            }

            await department.destroy();
            return res.status(200).json({ message: 'Отдел успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении отдела:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 10) Проверка существования записи
    async exists(req, res) {
        try {
            const { id } = req.params;
            const department = await Department.findByPk(id);
            return res.json({ exists: !!department });
        } catch (error) {
            console.error('Ошибка при проверке существования отдела:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new DepartmentController();