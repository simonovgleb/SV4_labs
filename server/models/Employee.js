// models/Employee.js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

// Регулярное выражение для проверки URL (можно настроить по требованиям)
const URL_REGEX = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;

// Регулярное выражение для проверки формата телефонного номера
const PHONE_REGEX = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;

// Регулярное выражение для проверки email
const EMAIL_REGEX = /.+\@.+\..+/;

const EmployeeSchema = new Schema({
    employeeCode: {
        type: String,
        required: [true, 'Employee code is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Employee code cannot exceed 50 characters'],
        match: [/^EMP-\d{4}$/, 'Employee code must follow the format EMP-XXXX'],
    },
    departmentCode: {
        type: String,
        required: [true, 'Department code is required'],
        trim: true,
        maxlength: [50, 'Department code cannot exceed 50 characters'],
        match: [/^DEP-\d{3}$/, 'Department code must follow the format DEP-XXX'],
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters'],
        minlength: [3, 'Full name must be at least 3 characters long'],
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary cannot be negative'],
        max: [1000000, 'Salary exceeds the maximum allowed value'],
    },
    bonus: {
        type: Number,
        default: 0,
        min: [0, 'Bonus cannot be negative'],
        max: [50000, 'Bonus exceeds the maximum allowed value'],
    },
    month: {
        type: Number,
        required: [true, 'Month is required'],
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12'],
    },
    photo: {
        type: String, // URL или путь к файлу изображения
        default: '',
        trim: true,
        validate: {
            validator: function (value) {
                if (value === '') return true;
                return URL_REGEX.test(value);
            },
            message: 'Invalid photo URL. Must be a valid image URL.',
        },
    },
    hireDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Hire date cannot be in the future',
        },
    },
    contactInfo: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [PHONE_REGEX, 'Please enter a valid phone number format: +7 (999) 999-99-99'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [EMAIL_REGEX, 'Please enter a valid email'],
        },
        // Другие контактные данные при необходимости
        address: {
            type: String,
            trim: true,
            maxlength: [200, 'Address cannot exceed 200 characters'],
        },
        // Например, можно добавить поле skype или другие контакты
    },
}, {
    timestamps: true,
});

// Применение плагина для валидации уникальности
EmployeeSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Индексы для оптимизации поиска и сортировки
EmployeeSchema.index({ employeeCode: 1 });
EmployeeSchema.index({ departmentCode: 1 });
EmployeeSchema.index({ fullName: 1 });

export default mongoose.model('Employee', EmployeeSchema);
