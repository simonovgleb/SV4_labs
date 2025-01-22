import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// 1) Получение списка организаций
export const fetchOrganizations = createAsyncThunk(
    'organizations/fetchOrganizations',
    async (params = {}) => {
        // params может содержать page, limit, sortBy, order, search и т.д.
        const queryString = new URLSearchParams(params).toString();
        // Пример: GET /organizations?page=1&limit=10&sortBy=name&order=asc
        const { data } = await axios.get(`/organizations?${queryString}`);
        // Ожидается формат ответа: { total, page, pageSize, organizations: [...] }
        return data;
    }
);

// 2) Получение конкретной организации по ID
export const fetchOrganizationById = createAsyncThunk(
    'organizations/fetchOrganizationById',
    async (id) => {
        const { data } = await axios.get(`/organizations/${id}`);
        // Ожидается объект одной организации
        return data;
    }
);

// 3) Создание новой организации
export const createOrganization = createAsyncThunk(
    'organizations/createOrganization',
    async (orgData) => {
        // POST /organizations
        const { data } = await axios.post('/organizations', orgData);
        // Ожидается объект новой организации
        return data;
    }
);

// 4) Обновление существующей организации по ID
export const updateOrganization = createAsyncThunk(
    'organizations/updateOrganization',
    async ({ id, updatedData }) => {
        // PUT (или PATCH) /organizations/:id
        const { data } = await axios.put(`/organizations/${id}`, updatedData);
        // Возвращаем обновлённую организацию
        return data;
    }
);

// 5) Удаление организации по ID
export const deleteOrganization = createAsyncThunk(
    'organizations/deleteOrganization',
    async (id) => {
        // DELETE /organizations/:id
        await axios.delete(`/organizations/${id}`);
        // Возвращаем id, чтобы удалить из state
        return id;
    }
);

// Начальное состояние
const initialState = {
    items: [],           // Список всех организаций
    currentItem: null,   // Текущая выбранная организация
    status: 'idle',      // idle | loading | succeeded | failed
    error: null          // Сообщение об ошибке
};

const organizationSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        // Добавьте sync-редьюсеры, если нужно
    },
    extraReducers: (builder) => {
        // =============== fetchOrganizations ===============
        builder
            .addCase(fetchOrganizations.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                // action.payload: { total, page, pageSize, organizations: [] }
                state.items = action.payload.organizations;
                state.status = 'succeeded';
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== fetchOrganizationById ===============
            .addCase(fetchOrganizationById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.currentItem = null;
            })
            .addCase(fetchOrganizationById.fulfilled, (state, action) => {
                // action.payload: объект одной организации
                state.status = 'succeeded';
                state.currentItem = action.payload;
            })
            .addCase(fetchOrganizationById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.currentItem = null;
            })

            // =============== createOrganization ===============
            .addCase(createOrganization.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrganization.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Добавляем новую организацию в массив items
                state.items.push(action.payload);
            })
            .addCase(createOrganization.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== updateOrganization ===============
            .addCase(updateOrganization.fulfilled, (state, action) => {
                const updated = action.payload;
                // Находим индекс в массиве
                const index = state.items.findIndex((item) => item._id === updated._id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // =============== deleteOrganization ===============
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                const id = action.payload;
                state.items = state.items.filter((item) => item._id !== id);
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const organizationsReducer = organizationSlice.reducer;