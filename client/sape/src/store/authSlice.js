// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// -------------------- РЕГИСТРАЦИЯ -------------------- //

// Регистрация пользователя
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ login, password }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/registration', {
                login,
                password,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Регистрация администратора
export const registerAdmin = createAsyncThunk(
    'auth/registerAdmin',
    async ({ login, password }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/admins/registration', {
                login,
                password,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// -------------------- ЛОГИН -------------------- //

// Логин администратора
export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async ({ login, password }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/admins/login', {
                login,
                password,
            });
            // Сохраняем токен в localStorage
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Логин пользователя
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ login, password }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/login', {
                login,
                password,
            });
            // Сохраняем токен в localStorage
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// -------------------- ВЫХОД И ПРОВЕРКА АУТЕНТИФИКАЦИИ -------------------- //

// Выход из системы
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
});

// Проверка аутентификации
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return thunkAPI.rejectWithValue('No token found');
        }

        try {
            // Сначала пробуем проверить как администратор
            const adminResponse = await axiosInstance.get('/admins/auth', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (adminResponse.data?.user) {
                return { user: adminResponse.data.user, token };
            }
        } catch (error) {
            // Если не получилось проверить как администратор, игнорируем
        }

        try {
            // Пробуем проверить как пользователь
            const userResponse = await axiosInstance.get('/users/auth', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userResponse.data?.user) {
                return { user: userResponse.data.user, token };
            }
        } catch (error) {
            // Если не получилось проверить как пользователь, игнорируем
        }

        // Если ни один запрос не прошёл
        return thunkAPI.rejectWithValue('Invalid token');
    }
);

// -------------------- СМЕНА ПАРОЛЯ -------------------- //

// Смена пароля администратора
export const changeAdminPassword = createAsyncThunk(
    'auth/changeAdminPassword',
    async ({ adminId, currentPassword, newPassword }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post(
                `/admins/${adminId}/change-password`,
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Смена пароля пользователя
export const changeUserPassword = createAsyncThunk(
    'auth/changeUserPassword',
    async ({ userId, currentPassword, newPassword }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post(
                `/users/${userId}/change-password`,
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// -------------------- ВОССТАНОВЛЕНИЕ ПАРОЛЯ -------------------- //

// Запрос на генерацию токена для восстановления пароля (администратор)
export const requestAdminPasswordReset = createAsyncThunk(
    'auth/requestAdminPasswordReset',
    async ({ login }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/admins/request-password-reset', {
                login,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Запрос на генерацию токена для восстановления пароля (пользователь)
export const requestUserPasswordReset = createAsyncThunk(
    'auth/requestUserPasswordReset',
    async ({ login }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/request-password-reset', {
                login,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Сброс пароля по токену (администратор)
export const resetAdminPassword = createAsyncThunk(
    'auth/resetAdminPassword',
    async ({ token, newPassword }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/admins/reset-password', {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// Сброс пароля по токену (пользователь)
export const resetUserPassword = createAsyncThunk(
    'auth/resetUserPassword',
    async ({ token, newPassword }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/reset-password', {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

// -------------------- INITIAL STATE -------------------- //

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    // Можно хранить дополнительные поля для статусов/сообщений по смене/сбросу пароля:
    passwordChangeSuccess: false,
    passwordResetSuccess: false,
    passwordResetTokenMessage: null, // например, сообщение с токеном или успехом
};

// -------------------- SLICE -------------------- //

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // При необходимости можно добавить синхронные экшены
        // setError: (state, action) => { state.error = action.payload; },
        // clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        // -------------------- Регистрация пользователя --------------------
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось зарегистрировать пользователя';
        });

        // -------------------- Регистрация администратора --------------------
        builder.addCase(registerAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerAdmin.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(registerAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось зарегистрировать администратора';
        });

        // -------------------- Логин администратора --------------------
        builder.addCase(loginAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось авторизоваться как администратор';
        });

        // -------------------- Логин пользователя --------------------
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось авторизоваться как сотрудник';
        });

        // -------------------- Выход из системы --------------------
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
        });

        // -------------------- Проверка аутентификации --------------------
        builder.addCase(checkAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.token = null;
            state.error =
                action.payload || 'Не удалось проверить аутентификацию';
        });

        // -------------------- Смена пароля админа --------------------
        builder.addCase(changeAdminPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordChangeSuccess = false;
        });
        builder.addCase(changeAdminPassword.fulfilled, (state) => {
            state.loading = false;
            state.passwordChangeSuccess = true;
        });
        builder.addCase(changeAdminPassword.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось сменить пароль администратора';
        });

        // -------------------- Смена пароля пользователя --------------------
        builder.addCase(changeUserPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordChangeSuccess = false;
        });
        builder.addCase(changeUserPassword.fulfilled, (state) => {
            state.loading = false;
            state.passwordChangeSuccess = true;
        });
        builder.addCase(changeUserPassword.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Не удалось сменить пароль пользователя';
        });

        // -------------------- Запрос на восстановление пароля (админ) --------------------
        builder.addCase(requestAdminPasswordReset.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordResetTokenMessage = null;
        });
        builder.addCase(requestAdminPasswordReset.fulfilled, (state, action) => {
            state.loading = false;
            // Сервер может возвращать { message, token } — сохраним, если нужно
            state.passwordResetTokenMessage = action.payload?.message || 'Токен выдан';
        });
        builder.addCase(requestAdminPasswordReset.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Ошибка при запросе на сброс пароля (admin)';
        });

        // -------------------- Запрос на восстановление пароля (пользователь) --------------------
        builder.addCase(requestUserPasswordReset.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordResetTokenMessage = null;
        });
        builder.addCase(requestUserPasswordReset.fulfilled, (state, action) => {
            state.loading = false;
            state.passwordResetTokenMessage = action.payload?.message || 'Токен выдан';
        });
        builder.addCase(requestUserPasswordReset.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Ошибка при запросе на сброс пароля (user)';
        });

        // -------------------- Сброс пароля по токену (админ) --------------------
        builder.addCase(resetAdminPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordResetSuccess = false;
        });
        builder.addCase(resetAdminPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.passwordResetSuccess = true;
        });
        builder.addCase(resetAdminPassword.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Ошибка при сбросе пароля (admin)';
        });

        // -------------------- Сброс пароля по токену (пользователь) --------------------
        builder.addCase(resetUserPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.passwordResetSuccess = false;
        });
        builder.addCase(resetUserPassword.fulfilled, (state) => {
            state.loading = false;
            state.passwordResetSuccess = true;
        });
        builder.addCase(resetUserPassword.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message || 'Ошибка при сбросе пароля (user)';
        });
    },
});

export default authSlice.reducer;
