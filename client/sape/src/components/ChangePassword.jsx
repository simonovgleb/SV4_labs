import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAdminPassword, changeUserPassword } from '../store/authSlice';

const ChangePassword = () => {
    const dispatch = useDispatch();

    const { user, loading, error, passwordChangeSuccess } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const { currentPassword, newPassword } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Вы не авторизованы');
            return;
        }

        try {
            if (user.role === 'admin') {
                await dispatch(
                    changeAdminPassword({
                        adminId: user.id,
                        currentPassword,
                        newPassword,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    changeUserPassword({
                        userId: user.id,
                        currentPassword,
                        newPassword,
                    })
                ).unwrap();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Смена пароля</h2>

            <form onSubmit={onSubmit} className="card p-4">
                <div className="form-group">
                    <label>Текущий пароль:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={currentPassword}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Новый пароль:</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={onChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    disabled={loading}
                >
                    {loading ? 'Сохраняем...' : 'Сменить пароль'}
                </button>
            </form>

            {/* Сообщения об успехе или ошибке */}
            {error && <p className="text-danger mt-3">{error}</p>}
            {passwordChangeSuccess && (
                <p className="text-success mt-3">Пароль успешно изменён!</p>
            )}
        </div>
    );
};

export default ChangePassword;
