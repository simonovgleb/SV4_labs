// models/Delivery.js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

// Список допустимых типов оборудования
const EQUIPMENT_TYPES = [
    'АЦП NM с AM1',
    'АЦП NM без усилителя',
    'АЦП NM с U2',
    'АЦП NM с AM2',
    // Добавьте другие типы оборудования по мере необходимости
];

// Регулярное выражение для проверки формата номера контракта
const CONTRACT_NUMBER_REGEX = /^CONTRACT-\d{4}-\d{2}$/;

// Регулярное выражение для проверки URL (можно настроить по требованиям)
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$/i;

const DeliverySchema = new Schema({
    contractNumber: {
        type: String,
        required: [true, 'Contract number is required'],
        unique: true,
        trim: true,
        match: [CONTRACT_NUMBER_REGEX, 'Contract number must follow the format CONTRACT-XXXX-XX'],
        maxlength: [20, 'Contract number cannot exceed 20 characters'],
    },
    equipmentType: {
        type: String,
        required: [true, 'Equipment type is required'],
        enum: {
            values: EQUIPMENT_TYPES,
            message: 'Invalid equipment type',
        },
    },
    userComment: {
        type: String,
        default: '',
        trim: true,
        maxlength: [500, 'User comment cannot exceed 500 characters'],
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required'],
        validate: {
            validator: async function (value) {
                const Employee = mongoose.model('Employee');
                const employee = await Employee.findById(value);
                return !!employee;
            },
            message: 'Employee not found',
        },
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization ID is required'],
        validate: {
            validator: async function (value) {
                const Organization = mongoose.model('Organization');
                const organization = await Organization.findById(value);
                return !!organization;
            },
            message: 'Organization not found',
        },
    },
    deliveryDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Delivery date cannot be in the future',
        },
    },
    // Дополнительные поля при необходимости
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'canceled'],
            message: 'Invalid status value',
        },
        default: 'pending',
    },
}, {
    timestamps: true,
});

// Применение плагина для валидации уникальности
DeliverySchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Индексы для оптимизации поиска и сортировки
DeliverySchema.index({ contractNumber: 1 });
DeliverySchema.index({ equipmentType: 1 });
DeliverySchema.index({ deliveryDate: -1 });

export default mongoose.model('Delivery', DeliverySchema);
