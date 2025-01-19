// src/features/firstSlice/firstSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    todos: [],
    loading: false,
    error: null,
};

const firstSlice = createSlice({
    name: 'first',
    initialState,
    reducers: {
        // Create
        addTodo: {
            reducer(state, action) {
                const newTodo = action.payload;
                state.todos.push(newTodo);
            },
            // prepare позволяет кастомизировать payload и, например, сгенерировать id
            prepare(title) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        completed: false,
                    },
                };
            },
        },
        // Read: как правило, "Read" — это получение state из store через useSelector,
        // поэтому отдельный редьюсер для чтения не нужен.
        // Но если нужно загрузить с сервера, тогда используем createAsyncThunk.

        // Update
        toggleTodo(state, action) {
            const todoId = action.payload;
            const todo = state.todos.find((t) => t.id === todoId);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },

        // Delete
        removeTodo(state, action) {
            const todoId = action.payload;
            state.todos = state.todos.filter((t) => t.id !== todoId);
        },

        updateTodo(state, action) {
            const { id, newTitle } = action.payload;
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
                todo.title = newTitle;
            } else {
                state.error = 'Задача не найдена';
            }
        },

        // Ошибки будем сохранять в поле state.error,
        // если нужно "сбросить" ошибку
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, setError, clearError } = firstSlice.actions;
export default firstSlice.reducer;