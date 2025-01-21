import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';  // Импортируем настроенный экземпляр Axios

const API_BASE_URL = '/deliveries';

// Асинхронные действия (thunks) для операций CRUD с поставками с использованием Axios
export const fetchDeliveries = createAsyncThunk(
    'deliveries/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL, { params });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchDelivery = createAsyncThunk(
    'deliveries/fetchOne',
    async (contract_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/${contract_id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createDelivery = createAsyncThunk(
    'deliveries/create',
    async (deliveryData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_BASE_URL, deliveryData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateDelivery = createAsyncThunk(
    'deliveries/update',
    async ({ contract_id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/${contract_id}`, updateData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteDelivery = createAsyncThunk(
    'deliveries/delete',
    async (contract_id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}/${contract_id}`);
            return contract_id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Начальное состояние для поставок
const initialState = {
    list: [],
    total: 0,
    page: 1,
    totalPages: 0,
    currentDelivery: null,
    loading: false,
    error: null,
};

// Создание слайса для поставок
const deliverySlice = createSlice({
    name: 'deliveries',
    initialState,
    reducers: {
        clearCurrentDelivery(state) {
            state.currentDelivery = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchDeliveries
            .addCase(fetchDeliveries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveries.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchDeliveries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchDelivery
            .addCase(fetchDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDelivery.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDelivery = action.payload;
            })
            .addCase(fetchDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // createDelivery
            .addCase(createDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDelivery.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateDelivery
            .addCase(updateDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDelivery.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(
                    del => del.contract_id === action.payload.contract_id
                );
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (
                    state.currentDelivery &&
                    state.currentDelivery.contract_id === action.payload.contract_id
                ) {
                    state.currentDelivery = action.payload;
                }
            })
            .addCase(updateDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // deleteDelivery
            .addCase(deleteDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDelivery.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(
                    del => del.contract_id !== action.payload
                );
            })
            .addCase(deleteDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;