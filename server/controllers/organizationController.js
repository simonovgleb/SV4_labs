const { Op } = require('sequelize');
const { Organization, Contract } = require('../models/models');

class OrganizationController {
    // 1) Создание новой записи
    async create(req, res) {
        try {
            const {
                contract_id,
                country_code,
                city,
                address,
                phone,
                email,
                website,
            } = req.body;

            // Проверка обязательных полей
            if (!contract_id || !country_code || !city || !address || !phone || !email) {
                return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
            }

            const organization = await Organization.create({
                contract_id,
                country_code,
                city,
                address,
                phone,
                email,
                website,
            });

            return res.status(201).json(organization);
        } catch (error) {
            console.error('Ошибка при создании организации:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 2-5) Получение списка записей с поддержкой пагинации, сортировки, фильтрации и поиска
    async findAll(req, res) {
        try {
            let {
                page = 1,
                limit = 10,
                sortBy = 'organization_id',
                sortOrder = 'ASC',
                search = '',
                country_code,
                city,
                email,
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            const where = {};

            // Поиск по нескольким полям: city, email (расширить при необходимости)
            if (search) {
                where[Op.or] = [
                    { city: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ];
            }

            // Фильтрация по отдельным полям
            if (country_code) {
                where.country_code = country_code;
            }
            if (city) {
                where.city = city;
            }
            if (email) {
                where.email = email;
            }

            const result = await Organization.findAndCountAll({
                where,
                limit,
                offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
                include: [{ model: Contract }], // подключение данных о договоре при необходимости
            });

            return res.json({
                data: result.rows,
                total: result.count,
                page,
                totalPages: Math.ceil(result.count / limit),
            });
        } catch (error) {
            console.error('Ошибка при получении списка организаций:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 6) Получение детальной информации по ID
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const organization = await Organization.findByPk(id, {
                include: [{ model: Contract }],
            });

            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена' });
            }

            return res.json(organization);
        } catch (error) {
            console.error('Ошибка при получении организации:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 8) Обновление записи
    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                contract_id,
                country_code,
                city,
                address,
                phone,
                email,
                website,
            } = req.body;

            const organization = await Organization.findByPk(id);
            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена' });
            }

            // Обновление полей
            organization.contract_id = contract_id !== undefined ? contract_id : organization.contract_id;
            organization.country_code = country_code || organization.country_code;
            organization.city = city || organization.city;
            organization.address = address || organization.address;
            organization.phone = phone || organization.phone;
            organization.email = email || organization.email;
            organization.website = website || organization.website;

            await organization.save();

            return res.json(organization);
        } catch (error) {
            console.error('Ошибка при обновлении организации:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 9) Удаление записи
    async delete(req, res) {
        try {
            const { id } = req.params;
            const organization = await Organization.findByPk(id);
            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена' });
            }

            await organization.destroy();
            return res.status(200).json({ message: 'Организация успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении организации:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // 10) Проверка существования записи
    async exists(req, res) {
        try {
            const { id } = req.params;
            const organization = await Organization.findByPk(id);
            return res.json({ exists: !!organization });
        } catch (error) {
            console.error('Ошибка при проверке существования организации:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new OrganizationController();
