// routes/employeeRoutes.js
import express from 'express';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    checkEmployeeExists
} from '../controllers/EmployeeController.js';

const router = express.Router();

// Создание нового сотрудника
router.post('/', createEmployee);

// Получение списка сотрудников с поддержкой пагинации, сортировки, фильтрации и поиска
router.get('/', getAllEmployees);

// Проверка существования сотрудника по ID
router.head('/:id', checkEmployeeExists);

// Получение детальной информации о сотруднике по ID
router.get('/:id', getEmployeeById);

// Обновление информации о сотруднике по ID
router.put('/:id', updateEmployee);

// Частичное обновление информации о сотруднике по ID (если необходимо)
router.patch('/:id', updateEmployee);

// Удаление сотрудника по ID
router.delete('/:id', deleteEmployee);

export default router;