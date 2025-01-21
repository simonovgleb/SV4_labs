// src/components/ChangePassword.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAdminPassword, changeUserPassword } from '../store/authSlice';

const ChangePassword = () => {
    const dispatch = useDispatch();

    // В auth хранится текущий пользователь, токен, ошибки и т.д.
    const { user, loading, error, passwordChangeSuccess } = useSelector(
        (state) => state.auth
    );

    // Локальное состояние для формы
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
    });

    // Извлекаем данные из formData
    const { currentPassword, newPassword } = formData;

    // Обработчик изменения инпутов
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Хендлер отправки формы
    const onSubmit = async (e) => {
        e.preventDefault();

        // Если в сторах нет информации о пользователе, 
        // значит он не авторизован, и мы не можем менять пароль
        if (!user) {
            alert('Вы не авторизованы');
            return;
        }

        try {
            // Если роль — администратор
            if (user.role === 'admin') {
                await dispatch(
                    changeAdminPassword({
                        adminId: user.id,
                        currentPassword,
                        newPassword,
                    })
                ).unwrap();
            } else {
                // Иначе роль — пользователь
                await dispatch(
                    changeUserPassword({
                        userId: user.id,
                        currentPassword,
                        newPassword,
                    })
                ).unwrap();
            }

            // В этот момент пароль успешно сменён (если не было выброшено исключение)
            // Вы можете дополнительно показать уведомление, например toast.success(...) 
            // или просто использовать флаг passwordChangeSuccess.
            // console.log('Пароль изменен успешно');
        } catch (err) {
            // Если произошла ошибка, она обычно уже попадёт в state.error
            // Но при желании можно как-то отдельно её отловить.
            // console.error(err);
        }
    };

    return (
        <div>
            <h2>Смена пароля</h2>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Текущий пароль:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={onChange}
                        required
                    />
                </div>

                <div>
                    <label>Новый пароль:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={onChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Сохраняем...' : 'Сменить пароль'}
                </button>
            </form>

            {/* Вывод ошибок или успеха */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {passwordChangeSuccess && (
                <p style={{ color: 'green' }}>Пароль успешно изменён!</p>
            )}
        </div>
    );
};

export default ChangePassword;