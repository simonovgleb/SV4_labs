import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// 1) Получение списка поставок (с поддержкой фильтрации, сортировки, пагинации и поиска, если нужно)
export const fetchDeliveries = createAsyncThunk(
    'deliveries/fetchDeliveries',
    async (params = {}) => {
        // params может содержать page, limit, sortBy, order, search и другие фильтры
        const queryString = new URLSearchParams(params).toString();
        // Пример: GET /deliveries?page=1&limit=10&sortBy=deliveryDate&order=desc
        const { data } = await axios.get(`/deliveries?${queryString}`);
        return data; // Ожидается формат: { total, page, pageSize, deliveries: [] }
    }
);

// 2) Получение конкретной поставки по ID
export const fetchDeliveryById = createAsyncThunk(
    'deliveries/fetchDeliveryById',
    async (id) => {
        const { data } = await axios.get(`/deliveries/${id}`);
        return data; // Ожидается объект одной поставки
    }
);

// 3) Создание новой поставки
export const createDelivery = createAsyncThunk(
    'deliveries/createDelivery',
    async (deliveryData) => {
        // POST /deliveries
        const { data } = await axios.post('/deliveries', deliveryData);
        return data; // Ожидается объект новой поставки
    }
);

// 4) Обновление существующей поставки по ID
export const updateDelivery = createAsyncThunk(
    'deliveries/updateDelivery',
    async ({ id, updatedData }) => {
        // PUT или PATCH /deliveries/:id
        const { data } = await axios.put(`/deliveries/${id}`, updatedData);
        return data; // Обновлённая поставка
    }
);

// 5) Удаление поставки по ID
export const deleteDelivery = createAsyncThunk(
    'deliveries/deleteDelivery',
    async (id) => {
        // DELETE /deliveries/:id
        await axios.delete(`/deliveries/${id}`);
        return id; // Возвращаем только id, чтобы удалить из state
    }
);

// Начальное состояние
const initialState = {
    items: [],            // Список всех поставок
    currentItem: null,    // Текущая выбранная поставка (при запросе fetchDeliveryById)
    status: 'idle',       // idle | loading | succeeded | failed
    error: null           // Сообщение об ошибке
};

const deliverySlice = createSlice({
    name: 'deliveries',
    initialState,
    reducers: {
        // Если вам понадобятся синхронные редьюсеры, вы можете добавить их здесь
        // Например, для локального изменения статуса без запроса к серверу
    },
    extraReducers: (builder) => {
        // =============== fetchDeliveries ===============
        builder
            .addCase(fetchDeliveries.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDeliveries.fulfilled, (state, action) => {
                // action.payload: { total, page, pageSize, deliveries: [] }
                state.items = action.payload.deliveries;
                state.status = 'succeeded';
            })
            .addCase(fetchDeliveries.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== fetchDeliveryById ===============
            .addCase(fetchDeliveryById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.currentItem = null;
            })
            .addCase(fetchDeliveryById.fulfilled, (state, action) => {
                // action.payload: объект одной поставки
                state.status = 'succeeded';
                state.currentItem = action.payload;
            })
            .addCase(fetchDeliveryById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.currentItem = null;
            })

            // =============== createDelivery ===============
            .addCase(createDelivery.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createDelivery.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Добавляем новую поставку в массив items
                state.items.push(action.payload);
            })
            .addCase(createDelivery.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== updateDelivery ===============
            .addCase(updateDelivery.fulfilled, (state, action) => {
                const updated = action.payload;
                // Находим индекс изменённой поставки в массиве
                const index = state.items.findIndex((item) => item._id === updated._id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })
            .addCase(updateDelivery.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // =============== deleteDelivery ===============
            .addCase(deleteDelivery.fulfilled, (state, action) => {
                const id = action.payload;  // Возвращённый из thunk
                state.items = state.items.filter((item) => item._id !== id);
            })
            .addCase(deleteDelivery.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const deliveriesReducer = deliverySlice.reducer;