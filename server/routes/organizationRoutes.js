// routes/organizationRoutes.js
import express from 'express';
import {
    createOrganization,
    getAllOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    checkOrganizationExists
} from '../controllers/OrganizationController.js';

const router = express.Router();

// Создание новой организации
router.post('/', createOrganization);

// Получение списка организаций с поддержкой пагинации, сортировки, фильтрации и поиска
router.get('/', getAllOrganizations);

// Проверка существования организации по ID
router.head('/:id', checkOrganizationExists);

// Получение детальной информации об организации по ID
router.get('/:id', getOrganizationById);

// Обновление информации об организации по ID
router.put('/:id', updateOrganization);

// Частичное обновление информации об организации по ID (если необходимо)
router.patch('/:id', updateOrganization);

// Удаление организации по ID
router.delete('/:id', deleteOrganization);

export default router;
