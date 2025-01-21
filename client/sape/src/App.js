import React from 'react';
import './App.css';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import DepartmentList from './components/DepartmentList';
import ContractList from './components/ContractList';
import DeliveryList from './components/DeliveryList';
import OrganizationList from './components/OrganizationList';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Добавлено перенаправление с корневого пути на /employees */}
        <Route path="/" element={<Navigate to="/employees" replace />} />

        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/deliveries" element={<DeliveryList />} />
        <Route path="/organizations" element={<OrganizationList />} />

        {/* Обработчик неизвестных маршрутов */}
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
    </div>
  );
}

export default App;
