// models/Employee.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    employeeCode: {
        type: String,
        required: true,
        unique: true,
    },
    departmentCode: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
        default: 0,
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    photo: {
        type: String, // URL или путь к файлу изображения
        default: '', // Можно оставить пустым, если фото отсутствует
    },
    // Дополнительные поля при необходимости
    hireDate: {
        type: Date,
        default: Date.now,
    },
    contactInfo: {
        phone: String,
        email: String,
        // Другие контактные данные
    },
}, {
    timestamps: true, // Добавляет поля createdAt и updatedAt
});

export default mongoose.model('Employee', EmployeeSchema);