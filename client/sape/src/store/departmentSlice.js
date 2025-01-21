import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';  // Импортируем настроенный экземпляр Axios

// Базовый URL для API запросов к отделам
const API_BASE_URL = '/departments';

// Асинхронные действия (thunks) для операций CRUD с отделами с использованием Axios
export const fetchDepartments = createAsyncThunk(
    'departments/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL, { params });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchDepartment = createAsyncThunk(
    'departments/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'departments/create',
    async (departmentData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_BASE_URL, departmentData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/update',
    async ({ id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updateData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Начальное состояние
const initialState = {
    list: [],
    total: 0,
    page: 1,
    totalPages: 0,
    currentDepartment: null,
    loading: false,
    error: null,
};

// Создание слайса
const departmentSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        clearCurrentDepartment(state) {
            state.currentDepartment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchDepartments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchDepartment
            .addCase(fetchDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDepartment = action.payload;
            })
            .addCase(fetchDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // createDepartment
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateDepartment
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(dep => dep.department_id === action.payload.department_id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department_id) {
                    state.currentDepartment = action.payload;
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // deleteDepartment
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(dep => dep.department_id !== action.payload);
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Экспортируем экшены и редюсер
export const { clearCurrentDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;