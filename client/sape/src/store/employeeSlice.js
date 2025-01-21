import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';  // Импортируем настроенный экземпляр Axios

// Базовый URL для API запросов к сотрудникам
const API_BASE_URL = '/employees';

// Асинхронные действия (thunks) для операций CRUD с сотрудниками с использованием Axios
export const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL, { params });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchEmployee = createAsyncThunk(
    'employees/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/create',
    async (formData, { rejectWithValue }) => {
        try {
            // Здесь formData — это объект FormData, который вы формируете в компоненте
            const response = await axiosInstance.post('/employees', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/employees/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Начальное состояние для сотрудников
const initialState = {
    list: [],
    total: 0,
    page: 1,
    totalPages: 0,
    currentEmployee: null,
    loading: false,
    error: null,
};

// Создание слайса для сотрудников
const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        clearCurrentEmployee(state) {
            state.currentEmployee = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Обработка fetchEmployees
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Обработка fetchEmployee
            .addCase(fetchEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEmployee = action.payload;
            })
            .addCase(fetchEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Обработка createEmployee
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Обработка updateEmployee
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(emp => emp.employee_id === action.payload.employee_id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (state.currentEmployee && state.currentEmployee.employee_id === action.payload.employee_id) {
                    state.currentEmployee = action.payload;
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Обработка deleteEmployee
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(emp => emp.employee_id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Экспортируем экшены и редюсер
export const { clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;