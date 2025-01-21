const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Определение модели Department (Отделы)
const Department = sequelize.define('Department', {
    department_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    department_name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

// Определение модели Employee (Сотрудники)
const Employee = sequelize.define('Employee', {
    employee_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.FLOAT, allowNull: false },
    bonus: { type: DataTypes.FLOAT, allowNull: true },
    month: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

// Определение модели Contract (Договора)
const Contract = sequelize.define('Contract', {
    contract_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organization_name: { type: DataTypes.STRING, allowNull: false },
    date_conclusion: { type: DataTypes.DATE, allowNull: false },
    // Внешний ключ employee_id будет установлен через ассоциации
}, { timestamps: false });

// Определение модели Delivery (Поставки)
const Delivery = sequelize.define('Delivery', {
    contract_id: { type: DataTypes.INTEGER, primaryKey: true },
    equipment_type: { type: DataTypes.STRING, allowNull: false },
    user_comment: { type: DataTypes.STRING, allowNull: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: true }, // Дополнительная ссылка на сотрудника
}, { timestamps: false });

// Определение модели Organization (Организации)
const Organization = sequelize.define('Organization', {
    organization_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract_id: { type: DataTypes.INTEGER, allowNull: false },
    country_code: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false });

//
// Установка связей между моделями
//

// Связь между отделами и сотрудниками
Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

// Связь между сотрудниками и договорами
Employee.hasMany(Contract, { foreignKey: 'employee_id' });
Contract.belongsTo(Employee, { foreignKey: 'employee_id' });

// Связь между договорами и поставками (1:1)
Contract.hasOne(Delivery, { foreignKey: 'contract_id' });
Delivery.belongsTo(Contract, { foreignKey: 'contract_id' });

// Связь между договорами и организациями (1:M)
Contract.hasMany(Organization, { foreignKey: 'contract_id' });
Organization.belongsTo(Contract, { foreignKey: 'contract_id' });

// Дополнительная связь: сотрудник и поставки (если необходимо)
Employee.hasMany(Delivery, { foreignKey: 'employee_id' });
Delivery.belongsTo(Employee, { foreignKey: 'employee_id' });

module.exports = {
    Department,
    Employee,
    Contract,
    Delivery,
    Organization,
    sequelize,
};
