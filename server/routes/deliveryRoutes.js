// routes/deliveryRoutes.js
import express from 'express';
import {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
    checkDeliveryExists
} from '../controllers/deliveryController.js';

const router = express.Router();

// Создание новой поставки
router.post('/', createDelivery);

// Получение списка поставок с поддержкой пагинации, сортировки, фильтрации и поиска
router.get('/', getAllDeliveries);

// Проверка существования поставки по ID
router.head('/:id', checkDeliveryExists);

// Получение детальной информации о поставке по ID
router.get('/:id', getDeliveryById);

// Обновление поставки по ID
router.put('/:id', updateDelivery);

// Частичное обновление поставки по ID 
router.patch('/:id', updateDelivery);

// Удаление поставки по ID
router.delete('/:id', deleteDelivery);

export default router;
