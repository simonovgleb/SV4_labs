// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import TodoItemEdit from './components/TodoItemEdit';  // форма редактирования
import NotFound from './components/NotFound';          // 404, для примера
import LanguageSwitcher from './components/LanguageSwitcher';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div>
      <LanguageSwitcher></LanguageSwitcher>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/edit/:id" element={<TodoItemEdit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
