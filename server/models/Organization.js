// models/Organization.js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

// Регулярное выражение для проверки формата кода организации
const ORGANIZATION_CODE_REGEX = /^ORG-\d{4}$/;

// Регулярное выражение для проверки формата телефонного номера
const PHONE_REGEX = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;

// Регулярное выражение для проверки email
const EMAIL_REGEX = /.+\@.+\..+/;

// Регулярное выражение для проверки URL 
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$/i;

const OrganizationSchema = new Schema({
    organizationCode: {
        type: String,
        required: [true, 'Organization code is required'],
        unique: true,
        trim: true,
        maxlength: [20, 'Organization code cannot exceed 20 characters'],
        match: [ORGANIZATION_CODE_REGEX, 'Organization code must follow the format ORG-XXXX'],
    },
    name: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
        maxlength: [100, 'Organization name cannot exceed 100 characters'],
        minlength: [3, 'Organization name must be at least 3 characters long'],
    },
    contractDate: {
        type: Date,
        required: [true, 'Contract date is required'],
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Contract date cannot be in the future',
        },
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxlength: [100, 'Country cannot exceed 100 characters'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [100, 'City cannot exceed 100 characters'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters'],
    },
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
    website: {
        type: String,
        default: '',
        trim: true,
        validate: {
            validator: function (value) {
                if (value === '') return true;
                return URL_REGEX.test(value);
            },
            message: 'Invalid website URL',
        },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
}, {
    timestamps: true,
});

OrganizationSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

OrganizationSchema.index({ organizationCode: 1 });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ country: 1 });
OrganizationSchema.index({ city: 1 });

export default mongoose.model('Organization', OrganizationSchema);
