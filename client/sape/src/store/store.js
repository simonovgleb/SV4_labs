import { configureStore } from '@reduxjs/toolkit';
import departmentReducer from './departmentSlice';
import employeeReducer from './employeeSlice';
import contractReducer from './contractSlice';
import deliveryReducer from './deliverySlice';
import organizationReducer from './organizationSlice';
import authReducer from './authSlice';
// Импортируйте другие редюсеры по мере необходимости

const store = configureStore({
    reducer: {
        departments: departmentReducer,
        employees: employeeReducer,
        contracts: contractReducer,
        deliveries: deliveryReducer,
        organizations: organizationReducer,
        auth: authReducer,
    },
});

export default store;