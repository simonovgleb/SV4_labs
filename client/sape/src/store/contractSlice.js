import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';  // Импортируем настроенный экземпляр Axios

// Асинхронные действия (thunks) для операций CRUD с договорами с использованием Axios
export const fetchContracts = createAsyncThunk(
    'contracts/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/contracts', { params });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchContract = createAsyncThunk(
    'contracts/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/contracts/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createContract = createAsyncThunk(
    'contracts/create',
    async (contractData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/contracts', contractData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateContract = createAsyncThunk(
    'contracts/update',
    async ({ id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/contracts/${id}`, updateData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteContract = createAsyncThunk(
    'contracts/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/contracts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Начальное состояние для договоров
const initialState = {
    list: [],
    total: 0,
    page: 1,
    totalPages: 0,
    currentContract: null,
    loading: false,
    error: null,
};

// Создание слайса для договоров
const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        clearCurrentContract(state) {
            state.currentContract = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContract.fulfilled, (state, action) => {
                state.loading = false;
                state.currentContract = action.payload;
            })
            .addCase(fetchContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(
                    con => con.contract_id === action.payload.contract_id
                );
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (
                    state.currentContract &&
                    state.currentContract.contract_id === action.payload.contract_id
                ) {
                    state.currentContract = action.payload;
                }
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteContract.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(
                    con => con.contract_id !== action.payload
                );
            })
            .addCase(deleteContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer;
