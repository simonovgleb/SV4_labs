// controllers/DeliveryController.js
import DeliveryModel from '../models/Delivery.js';

// Создание новой поставки (договора)
export const createDelivery = async (req, res) => {
    try {
        const {
            contractNumber,
            equipmentType,
            userComment,
            employeeId,
            organizationId,
            deliveryDate,
            notes,
            status,
        } = req.body;

        const delivery = new DeliveryModel({
            contractNumber,
            equipmentType,
            userComment,
            employeeId,
            organizationId,
            deliveryDate,
            notes,
            status,
        });

        const savedDelivery = await delivery.save();
        res.status(201).json(savedDelivery);
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Извлечение сообщений об ошибках валидации
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ errors });
        }
        if (err.code === 11000) { // Ошибка дублирования
            res.status(400).json({ message: 'Contract number must be unique' });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
};

// Получение списка поставок с поддержкой пагинации, сортировки, фильтрации и поиска
export const getAllDeliveries = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'deliveryDate', order = 'desc', ...filters } = req.query;

        // Формирование условия фильтрации
        const query = {};

        // Поддержка фильтрации по нескольким полям
        if (filters.contractNumber) {
            query.contractNumber = { $regex: filters.contractNumber, $options: 'i' };
        }
        if (filters.equipmentType) {
            query.equipmentType = filters.equipmentType;
        }
        if (filters.employeeId) {
            query.employeeId = filters.employeeId;
        }
        if (filters.organizationId) {
            query.organizationId = filters.organizationId;
        }
        if (filters.status) {
            query.status = filters.status;
        }

        // Поддержка поиска по нескольким полям (например, contractNumber и equipmentType)
        if (filters.search) {
            query.$or = [
                { contractNumber: { $regex: filters.search, $options: 'i' } },
                { equipmentType: { $regex: filters.search, $options: 'i' } },
                { 'employeeId.fullName': { $regex: filters.search, $options: 'i' } },
                { 'organizationId.name': { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Поддержка сортировки
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        // Поддержка пагинации
        const deliveries = await DeliveryModel.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('employeeId', 'fullName position') // Популяция данных сотрудника
            .populate('organizationId', 'name country city'); // Популяция данных организации

        // Получение общего количества документов для пагинации
        const total = await DeliveryModel.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pageSize: deliveries.length,
            deliveries,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Получение детальной информации о поставке по ID
export const getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await DeliveryModel.findById(id)
            .populate('employeeId', 'fullName position departmentCode')
            .populate('organizationId', 'name country city address');

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.json(delivery);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновление поставки по ID
export const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            contractNumber,
            equipmentType,
            userComment,
            employeeId,
            organizationId,
            deliveryDate,
            notes,
            status,
        } = req.body;

        // Поиск и обновление документа
        const delivery = await DeliveryModel.findById(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Обновление полей, если они предоставлены
        if (contractNumber !== undefined) delivery.contractNumber = contractNumber;
        if (equipmentType !== undefined) delivery.equipmentType = equipmentType;
        if (userComment !== undefined) delivery.userComment = userComment;
        if (employeeId !== undefined) delivery.employeeId = employeeId;
        if (organizationId !== undefined) delivery.organizationId = organizationId;
        if (deliveryDate !== undefined) delivery.deliveryDate = deliveryDate;
        if (notes !== undefined) delivery.notes = notes;
        if (status !== undefined) delivery.status = status;

        const updatedDelivery = await delivery.save();
        res.json(updatedDelivery);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ errors });
        }
        if (err.code === 11000) { // Ошибка дублирования
            res.status(400).json({ message: 'Contract number must be unique' });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
};

// Удаление поставки по ID
export const deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await DeliveryModel.findById(id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        await DeliveryModel.deleteOne({ _id: id });
        res.json({ message: 'Delivery successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Проверка существования поставки по ID
export const checkDeliveryExists = async (req, res) => {
    try {
        const { id } = req.params;

        const exists = await DeliveryModel.exists({ _id: id });

        if (exists) {
            res.json({ exists: true });
        } else {
            res.status(404).json({ exists: false, message: 'Delivery not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
