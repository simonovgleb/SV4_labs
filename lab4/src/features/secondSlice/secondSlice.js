// src/features/secondSlice/secondSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const secondSlice = createSlice({
    name: 'second',
    initialState,
    reducers: {
        // Create
        addUser: {
            reducer(state, action) {
                state.users.push(action.payload);
            },
            prepare({ name, email }) {
                return {
                    payload: {
                        id: nanoid(),
                        name,
                        email,
                    },
                };
            },
        },
        // Update
        updateUser(state, action) {
            const { id, newData } = action.payload; // newData = { name, email }
            const user = state.users.find((u) => u.id === id);
            if (user) {
                user.name = newData.name ?? user.name;
                user.email = newData.email ?? user.email;
            } else {
                state.error = 'Пользователь не найден';
            }
        },
        // Delete
        removeUser(state, action) {
            const userId = action.payload;
            state.users = state.users.filter((u) => u.id !== userId);
        },

        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { addUser, updateUser, removeUser, setError, clearError } = secondSlice.actions;
export default secondSlice.reducer;