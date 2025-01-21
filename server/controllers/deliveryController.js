const { Op } = require('sequelize');
const { Delivery, Contract, Employee } = require('../models/models');

class DeliveryController {
    // 1) Создание новой записи
    async create(req, res) {
        try {
            const { contract_id, equipment_type, user_comment, employee_id } = req.body;

            // Проверка обязательных полей
            if (!contract_id || !equipment_type) {
                return res.status(400).json({ message: 'Поля contract_id и equipment_type обязательны' });
            }

            // Создание записи о поставке
            const delivery = await Delivery.create({
                contract_id,
                equipment_type,
                user_comment,
                employee_id,
            });

            return res.status(201).json(delivery);
        } catch (error) {
            console.error('Ошибка при создании поставки:', error);
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
                equipment_type,
                employee_id,
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            const where = {};

            // Поиск по полю equipment_type
            if (search) {
                where.equipment_type = { [Op.iLike]: `%${search}%` };
            }

            // Дополнительная фильтрация
            if (equipment_type) {
                where.equipment_type = equipment_type;
            }
            if (employee_id) {
                where.employee_id = employee_id;
            }

            const result = await Delivery.findAndCountAll({
                where,
                limit,
                offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
                include: [
                    { model: Contract },
                    { model: Employee }
                ],
            });

            return res.json({
                data: result.rows,
                total: result.count,
                page,
                totalPages: Math.ceil(result.count / limit),
            });
        } catch (error) {
            console.error('Ошибка при получении списка поставок:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 6) Получение детальной информации по ID
    async findOne(req, res) {
        try {
            const { contract_id } = req.params;
            const delivery = await Delivery.findByPk(contract_id, {
                include: [
                    { model: Contract },
                    { model: Employee }
                ],
            });

            if (!delivery) {
                return res.status(404).json({ message: 'Поставка не найдена' });
            }

            return res.json(delivery);
        } catch (error) {
            console.error('Ошибка при получении поставки:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 8) Обновление записи
    async update(req, res) {
        try {
            const { contract_id } = req.params;
            const { equipment_type, user_comment, employee_id } = req.body;

            const delivery = await Delivery.findByPk(contract_id);
            if (!delivery) {
                return res.status(404).json({ message: 'Поставка не найдена' });
            }

            // Обновление полей
            delivery.equipment_type = equipment_type || delivery.equipment_type;
            delivery.user_comment = user_comment || delivery.user_comment;
            delivery.employee_id = employee_id !== undefined ? employee_id : delivery.employee_id;

            await delivery.save();

            return res.json(delivery);
        } catch (error) {
            console.error('Ошибка при обновлении поставки:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 9) Удаление записи
    async delete(req, res) {
        try {
            const { contract_id } = req.params;
            const delivery = await Delivery.findByPk(contract_id);
            if (!delivery) {
                return res.status(404).json({ message: 'Поставка не найдена' });
            }

            await delivery.destroy();
            return res.status(200).json({ message: 'Поставка успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении поставки:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 10) Проверка существования записи
    async exists(req, res) {
        try {
            const { contract_id } = req.params;
            const delivery = await Delivery.findByPk(contract_id);
            return res.json({ exists: !!delivery });
        } catch (error) {
            console.error('Ошибка при проверке существования поставки:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new DeliveryController();