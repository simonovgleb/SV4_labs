const { Op } = require('sequelize');
const { Contract, Employee } = require('../models/models');

class ContractController {
    // 1) Создание новой записи
    async create(req, res) {
        try {
            const { organization_name, date_conclusion, employee_id } = req.body;

            // Проверка обязательных полей
            if (!organization_name || !date_conclusion || !employee_id) {
                return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
            }

            // Можно добавить проверку существования сотрудника по employee_id при необходимости

            const contract = await Contract.create({
                organization_name,
                date_conclusion,
                employee_id,
            });

            return res.status(201).json(contract);
        } catch (error) {
            console.error('Ошибка при создании договора:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 2-5) Получение списка записей с поддержкой пагинации, сортировки, фильтрации и поиска
    async findAll(req, res) {
        try {
            let {
                page = 1,
                limit = 10,
                sortBy = 'contract_id',
                sortOrder = 'ASC',
                search = '',
                organization_name,
                employee_id,
                date_conclusion,
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            const where = {};

            // Поиск по полям organization_name
            if (search) {
                where.organization_name = { [Op.iLike]: `%${search}%` };
            }

            // Дополнительная фильтрация
            if (organization_name) {
                where.organization_name = organization_name;
            }
            if (employee_id) {
                where.employee_id = employee_id;
            }
            if (date_conclusion) {
                where.date_conclusion = date_conclusion;
            }

            const result = await Contract.findAndCountAll({
                where,
                limit,
                offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
                include: [{ model: Employee }], // подключение данных о сотруднике
            });

            return res.json({
                data: result.rows,
                total: result.count,
                page,
                totalPages: Math.ceil(result.count / limit),
            });
        } catch (error) {
            console.error('Ошибка при получении списка договоров:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 6) Получение детальной информации по ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const contract = await Contract.findByPk(id, {
                include: [{ model: Employee }],
            });

            if (!contract) {
                return res.status(404).json({ message: 'Договор не найден' });
            }

            return res.json(contract);
        } catch (error) {
            console.error('Ошибка при получении договора:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 8) Обновление записи
    async update(req, res) {
        try {
            const { id } = req.params;
            const { organization_name, date_conclusion, employee_id } = req.body;

            const contract = await Contract.findByPk(id);
            if (!contract) {
                return res.status(404).json({ message: 'Договор не найден' });
            }

            // Обновление полей
            contract.organization_name = organization_name || contract.organization_name;
            contract.date_conclusion = date_conclusion || contract.date_conclusion;
            contract.employee_id = employee_id !== undefined ? employee_id : contract.employee_id;

            await contract.save();

            return res.json(contract);
        } catch (error) {
            console.error('Ошибка при обновлении договора:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 9) Удаление записи
    async delete(req, res) {
        try {
            const { id } = req.params;
            const contract = await Contract.findByPk(id);
            if (!contract) {
                return res.status(404).json({ message: 'Договор не найден' });
            }

            await contract.destroy();
            return res.status(200).json({ message: 'Договор успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении договора:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 10) Проверка существования записи
    async exists(req, res) {
        try {
            const { id } = req.params;
            const contract = await Contract.findByPk(id);
            return res.json({ exists: !!contract });
        } catch (error) {
            console.error('Ошибка при проверке существования договора:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ContractController();