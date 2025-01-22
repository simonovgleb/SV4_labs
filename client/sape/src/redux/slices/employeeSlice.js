import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// 1) Получение списка сотрудников (с поддержкой фильтрации, сортировки, пагинации и поиска, если нужно)
export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (params = {}) => {
        // params может содержать page, limit, sortBy, order, search и другие фильтры
        const queryString = new URLSearchParams(params).toString();
        // Пример: GET /employees?page=1&limit=10&sortBy=fullName&order=asc
        const { data } = await axios.get(`/employees?${queryString}`);
        return data; // Ожидается формат: { total, page, pageSize, employees: [] }
    }
);

// 2) Получение конкретного сотрудника по ID
export const fetchEmployeeById = createAsyncThunk(
    'employees/fetchEmployeeById',
    async (id) => {
        const { data } = await axios.get(`/employees/${id}`);
        return data; // Ожидается объект одного сотрудника
    }
);

// 3) Создание нового сотрудника
export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async (employeeData) => {
        // POST /employees
        const { data } = await axios.post('/employees', employeeData);
        return data; // Ожидается объект нового сотрудника
    }
);

// 4) Обновление существующего сотрудника по ID
export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async ({ id, updatedData }) => {
        // PUT (или PATCH) /employees/:id
        const { data } = await axios.put(`/employees/${id}`, updatedData);
        return data; // Обновлённый сотрудник
    }
);

// 5) Удаление сотрудника по ID
export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (id) => {
        // DELETE /employees/:id
        await axios.delete(`/employees/${id}`);
        return id; // Возвращаем только id, чтобы удалить из state
    }
);

// Начальное состояние
const initialState = {
    items: [],           // Список всех сотрудников
    currentItem: null,   // Текущий выбранный сотрудник (при запросе fetchEmployeeById)
    status: 'idle',      // idle | loading | succeeded | failed
    error: null          // Сообщение об ошибке
};

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        // Если нужны синхронные редьюсеры, добавьте их здесь
    },
    extraReducers: (builder) => {
        // =============== fetchEmployees ===============
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                // action.payload: { total, page, pageSize, employees: [] }
                state.items = action.payload.employees;
                state.status = 'succeeded';
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== fetchEmployeeById ===============
            .addCase(fetchEmployeeById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.currentItem = null;
            })
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                // action.payload: объект одного сотрудника
                state.status = 'succeeded';
                state.currentItem = action.payload;
            })
            .addCase(fetchEmployeeById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.currentItem = null;
            })

            // =============== createEmployee ===============
            .addCase(createEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Добавляем нового сотрудника в массив items
                state.items.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // =============== updateEmployee ===============
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const updated = action.payload;
                // Находим индекс изменённого сотрудника в массиве items
                const index = state.items.findIndex((item) => item._id === updated._id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // =============== deleteEmployee ===============
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                const id = action.payload;  // Возвращённый из thunk
                state.items = state.items.filter((item) => item._id !== id);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const employeesReducer = employeeSlice.reducer;