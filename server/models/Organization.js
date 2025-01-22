// models/Organization.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrganizationSchema = new Schema({
    organizationCode: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    contractDate: {
        type: Date,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Пожалуйста, введите корректный email'],
    },
    website: {
        type: String,
        default: '',
    },
    // Дополнительные поля при необходимости
}, {
    timestamps: true,
});

export default mongoose.model('Organization', OrganizationSchema);