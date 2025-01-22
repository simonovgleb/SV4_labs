// models/Delivery.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const DeliverySchema = new Schema({
    contractNumber: {
        type: String,
        required: true,
        unique: true,
    },
    equipmentType: {
        type: String,
        required: true,
        enum: [
            'АЦП NM с AM1',
            'АЦП NM без усилителя',
            'АЦП NM с U2',
            'АЦП NM с AM2',
            // Добавьте другие типы оборудования по мере необходимости
        ],
    },
    userComment: {
        type: String,
        default: '',
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    deliveryDate: {
        type: Date,
        default: Date.now,
    },
    // Дополнительные поля при необходимости
}, {
    timestamps: true,
});

export default mongoose.model('Delivery', DeliverySchema);