import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import EmployeeList from './components/EmployeeList';
import DepartmentList from './components/DepartmentList';
import ContractList from './components/ContractList';
import DeliveryList from './components/DeliveryList';
import OrganizationList from './components/OrganizationList';
import AdminRegister from './components/auth/AdminRegister';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChangePassword from './components/ChangePassword.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/authSlice';
import PrivateRoute from './components/PrivateRoute.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={<h2 className="text-center">Добро пожаловать в систему управления!</h2>}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/login" element={<Login />} />

        <Route path="/change-password"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <ChangePassword />
            </PrivateRoute>}
        />
        <Route path="/employees"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <EmployeeList />
            </PrivateRoute>}
        />
        <Route path="/departments"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <DepartmentList />
            </PrivateRoute>}
        />
        <Route path="/contracts"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <ContractList />
            </PrivateRoute>}
        />
        <Route path="/deliveries"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <DeliveryList />
            </PrivateRoute>}
        />
        <Route path="/organizations"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <OrganizationList />
            </PrivateRoute>}
        />

        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
    </div >
  );
}

export default App;
