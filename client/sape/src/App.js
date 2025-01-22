import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; // Импортируем Header
import DeliveryManager from './components/delivery/DeliveryManager';
import EmployeeManager from './components/employee/EmployeeManager';
import OrganizationManager from './components/organization/OrganizationManager';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header /> {/* Добавляем Header здесь */}
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/deliveries" element={<DeliveryManager />} />
          <Route path="/employees" element={<EmployeeManager />} />
          <Route path="/organizations" element={<OrganizationManager />} />
          {/* Здесь аналогичные маршруты для других компонентов */}
          {/* Например, добавьте страницу 404 */}
          <Route path="*" element={<h2>Привет мир!</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
