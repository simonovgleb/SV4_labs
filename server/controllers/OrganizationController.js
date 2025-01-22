// controllers/OrganizationController.js
import OrganizationModel from '../models/Organization.js';

// Создание новой организации
export const createOrganization = async (req, res) => {
    try {
        const {
            organizationCode,
            name,
            contractDate,
            country,
            city,
            address,
            phone,
            email,
            website
        } = req.body;

        // Проверка уникальности organizationCode
        const existingOrganization = await OrganizationModel.findOne({ organizationCode });
        if (existingOrganization) {
            return res.status(400).json({ message: 'Organization code must be unique' });
        }

        const organization = new OrganizationModel({
            organizationCode,
            name,
            contractDate,
            country,
            city,
            address,
            phone,
            email,
            website,
        });

        const savedOrganization = await organization.save();
        res.status(201).json(savedOrganization);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Получение списка организаций с поддержкой пагинации, сортировки, фильтрации и поиска
export const getAllOrganizations = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'name',
            order = 'asc',
            ...filters
        } = req.query;

        const query = {};

        // Фильтрация по отдельным полям
        if (filters.organizationCode) {
            query.organizationCode = { $regex: filters.organizationCode, $options: 'i' };
        }
        if (filters.country) {
            query.country = { $regex: filters.country, $options: 'i' };
        }
        if (filters.city) {
            query.city = { $regex: filters.city, $options: 'i' };
        }
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }

        // Поиск по нескольким полям
        if (filters.search) {
            query.$or = [
                { organizationCode: { $regex: filters.search, $options: 'i' } },
                { name: { $regex: filters.search, $options: 'i' } },
                { country: { $regex: filters.search, $options: 'i' } },
                { city: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Сортировка
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        // Пагинация
        const organizations = await OrganizationModel.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Общее количество документов для пагинации
        const total = await OrganizationModel.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pageSize: organizations.length,
            organizations,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Получение детальной информации об организации по ID
export const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        const organization = await OrganizationModel.findById(id);

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(organization);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновление информации об организации по ID
export const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            organizationCode,
            name,
            contractDate,
            country,
            city,
            address,
            phone,
            email,
            website
        } = req.body;

        // Проверка существования организации
        const organization = await OrganizationModel.findById(id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Если меняется organizationCode, проверить уникальность
        if (organizationCode && organizationCode !== organization.organizationCode) {
            const existingOrganization = await OrganizationModel.findOne({ organizationCode });
            if (existingOrganization) {
                return res.status(400).json({ message: 'Organization code must be unique' });
            }
            organization.organizationCode = organizationCode;
        }

        // Обновление полей
        if (name !== undefined) organization.name = name;
        if (contractDate !== undefined) organization.contractDate = contractDate;
        if (country !== undefined) organization.country = country;
        if (city !== undefined) organization.city = city;
        if (address !== undefined) organization.address = address;
        if (phone !== undefined) organization.phone = phone;
        if (email !== undefined) organization.email = email;
        if (website !== undefined) organization.website = website;

        const updatedOrganization = await organization.save();
        res.json(updatedOrganization);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Удаление организации по ID
export const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const organization = await OrganizationModel.findById(id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        await OrganizationModel.deleteOne({ _id: id });
        res.json({ message: 'Organization successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Проверка существования организации по ID
export const checkOrganizationExists = async (req, res) => {
    try {
        const { id } = req.params;

        const exists = await OrganizationModel.exists({ _id: id });

        if (exists) {
            res.json({ exists: true });
        } else {
            res.status(404).json({ exists: false, message: 'Organization not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};