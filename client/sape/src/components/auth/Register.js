import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaLock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const { login, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                registerUser({
                    login,
                    password,
                })
            ).unwrap();
            toast.success('Регистрация прошла успешно! Пожалуйста, войдите в систему.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Не удалось зарегистрироваться');
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h3 className="text-center mb-4">
                            <FaUserPlus className="me-2" />
                            Регистрация пользователя
                        </h3>
                        <form onSubmit={onSubmit}>
                            {/* Логин */}
                            <div className="mb-3">
                                <label className="form-label">Логин:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        name="login"
                                        value={login}
                                        onChange={onChange}
                                        required
                                        placeholder="Введите логин"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            {/* Пароль */}
                            <div className="mb-3">
                                <label className="form-label">Пароль:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaLock />
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        placeholder="Введите пароль"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            {/* Кнопка отправки */}
                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        'Регистрируем...'
                                    ) : (
                                        <>
                                            <FaUserPlus className="me-2" />
                                            Зарегистрироваться
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
