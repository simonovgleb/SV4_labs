// controllers/EmployeeController.js
import EmployeeModel from '../models/Employee.js';

// Создание нового сотрудника
export const createEmployee = async (req, res) => {
    try {
        const {
            employeeCode,
            departmentCode,
            fullName,
            position,
            salary,
            bonus,
            month,
            photo,
            hireDate,
            contactInfo
        } = req.body;

        // Проверка уникальности employeeCode
        const existingEmployee = await EmployeeModel.findOne({ employeeCode });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee code must be unique' });
        }

        const employee = new EmployeeModel({
            employeeCode,
            departmentCode,
            fullName,
            position,
            salary,
            bonus,
            month,
            photo,
            hireDate,
            contactInfo,
        });

        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Получение списка сотрудников с поддержкой пагинации, сортировки, фильтрации и поиска
export const getAllEmployees = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'fullName',
            order = 'asc',
            ...filters
        } = req.query;

        const query = {};

        // Фильтрация по отдельным полям
        if (filters.employeeCode) {
            query.employeeCode = { $regex: filters.employeeCode, $options: 'i' };
        }
        if (filters.departmentCode) {
            query.departmentCode = filters.departmentCode;
        }
        if (filters.position) {
            query.position = { $regex: filters.position, $options: 'i' };
        }
        if (filters.fullName) {
            query.fullName = { $regex: filters.fullName, $options: 'i' };
        }

        // Поиск по нескольким полям
        if (filters.search) {
            query.$or = [
                { employeeCode: { $regex: filters.search, $options: 'i' } },
                { fullName: { $regex: filters.search, $options: 'i' } },
                { position: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Сортировка
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        // Пагинация
        const employees = await EmployeeModel.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Общее количество документов для пагинации
        const total = await EmployeeModel.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pageSize: employees.length,
            employees,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Получение детальной информации о сотруднике по ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновление информации о сотруднике по ID
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            employeeCode,
            departmentCode,
            fullName,
            position,
            salary,
            bonus,
            month,
            photo,
            hireDate,
            contactInfo
        } = req.body;

        // Проверка существования сотрудника
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Если меняется employeeCode, проверить уникальность
        if (employeeCode && employeeCode !== employee.employeeCode) {
            const existingEmployee = await EmployeeModel.findOne({ employeeCode });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee code must be unique' });
            }
            employee.employeeCode = employeeCode;
        }

        // Обновление полей
        if (departmentCode !== undefined) employee.departmentCode = departmentCode;
        if (fullName !== undefined) employee.fullName = fullName;
        if (position !== undefined) employee.position = position;
        if (salary !== undefined) employee.salary = salary;
        if (bonus !== undefined) employee.bonus = bonus;
        if (month !== undefined) employee.month = month;
        if (photo !== undefined) employee.photo = photo;
        if (hireDate !== undefined) employee.hireDate = hireDate;
        if (contactInfo !== undefined) employee.contactInfo = contactInfo;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Удаление сотрудника по ID
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await EmployeeModel.deleteOne({ _id: id });
        res.json({ message: 'Employee successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Проверка существования сотрудника по ID
export const checkEmployeeExists = async (req, res) => {
    try {
        const { id } = req.params;

        const exists = await EmployeeModel.exists({ _id: id });

        if (exists) {
            res.json({ exists: true });
        } else {
            res.status(404).json({ exists: false, message: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
