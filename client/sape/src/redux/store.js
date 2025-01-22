// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { deliveriesReducer } from './slices/deliverySlice';
import { employeesReducer } from './slices/employeeSlice';
import { organizationsReducer } from './slices/organizationSlice';

const store = configureStore({
    reducer: {
        deliveries: deliveriesReducer,
        employees: employeesReducer,
        organizations: organizationsReducer,
    },
});

export default store;
