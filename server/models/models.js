const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Определение модели Department (Отделы) с валидацией
const Department = sequelize.define('Department', {
    department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    department_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Название отдела не может быть пустым' },
            len: {
                args: [3, 100],
                msg: 'Название отдела должно содержать от 3 до 100 символов'
            }
        }
    },
}, { timestamps: false });

// Определение модели Employee (Сотрудники) с валидацией
const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'ФИО не может быть пустым' }
        }
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Должность не может быть пустой' }
        }
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: { msg: 'Зарплата должна быть числом' },
            min: {
                args: [0],
                msg: 'Зарплата не может быть отрицательной'
            }
        }
    },
    bonus: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: { msg: 'Премия должна быть числом' },
            min: {
                args: [0],
                msg: 'Премия не может быть отрицательной'
            }
        }
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Месяц не может быть пустым' }
        }
    },
    photo: {  // Новое поле для фотографии
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     isUrl: { msg: 'Фото должно быть URL-адресом' }
        // }
    }
}, { timestamps: false });

// Определение модели Contract (Договора) с валидацией
const Contract = sequelize.define('Contract', {
    contract_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Наименование организации не может быть пустым' }
        }
    },
    date_conclusion: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: 'Дата заключения должна быть в формате даты' },
            notEmpty: { msg: 'Дата заключения обязательна' }
        }
    },
}, { timestamps: false });

// Определение модели Delivery (Поставки) с валидацией
const Delivery = sequelize.define('Delivery', {
    contract_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    equipment_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Тип оборудования не может быть пустым' }
        }
    },
    user_comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, { timestamps: false });

// Определение модели Organization (Организации) с валидацией
const Organization = sequelize.define('Organization', {
    organization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contract_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Код страны обязателен' },
            len: {
                args: [2, 5],
                msg: 'Код страны должен содержать от 2 до 5 символов'
            }
        }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Город не может быть пустым' }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Адрес не может быть пустым' }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Телефон обязателен' },
            isNumeric: { msg: 'Телефон должен содержать только цифры' }
            // или используйте is: /^[0-9\-+() ]+$/ для более сложной проверки
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Email обязателен' },
            isEmail: { msg: 'Некорректный формат email' }
        }
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: { msg: 'Некорректный URL сайта' }
        }
    },
}, { timestamps: false });

//
// Установка связей между моделями
//

Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

Employee.hasMany(Contract, { foreignKey: 'employee_id' });
Contract.belongsTo(Employee, { foreignKey: 'employee_id' });

Contract.hasOne(Delivery, { foreignKey: 'contract_id' });
Delivery.belongsTo(Contract, { foreignKey: 'contract_id' });

Contract.hasMany(Organization, { foreignKey: 'contract_id' });
Organization.belongsTo(Contract, { foreignKey: 'contract_id' });

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
