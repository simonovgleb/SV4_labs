import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';  // Импортируем настроенный экземпляр Axios

const API_BASE_URL = '/organizations';

// Асинхронные действия (thunks) для операций CRUD с организациями с использованием Axios
export const fetchOrganizations = createAsyncThunk(
    'organizations/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL, { params });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchOrganization = createAsyncThunk(
    'organizations/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createOrganization = createAsyncThunk(
    'organizations/create',
    async (organizationData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_BASE_URL, organizationData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateOrganization = createAsyncThunk(
    'organizations/update',
    async ({ id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updateData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteOrganization = createAsyncThunk(
    'organizations/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Начальное состояние для организаций
const initialState = {
    list: [],
    total: 0,
    page: 1,
    totalPages: 0,
    currentOrganization: null,
    loading: false,
    error: null,
};

// Создание слайса для организаций
const organizationSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        clearCurrentOrganization(state) {
            state.currentOrganization = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchOrganizations
            .addCase(fetchOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchOrganization
            .addCase(fetchOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrganization = action.payload;
            })
            .addCase(fetchOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // createOrganization
            .addCase(createOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateOrganization
            .addCase(updateOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganization.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(org => org.organization_id === action.payload.organization_id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (state.currentOrganization && state.currentOrganization.organization_id === action.payload.organization_id) {
                    state.currentOrganization = action.payload;
                }
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // deleteOrganization
            .addCase(deleteOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(org => org.organization_id !== action.payload);
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;