import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaLock } from 'react-icons/fa';

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
            await dispatch(registerUser({
                login,
                password,
            })).unwrap();
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
        <div>
            <div>
                <div>
                    <div>
                        <h3>
                            <FaUserPlus />
                            Регистрация пользователя
                        </h3>
                    </div>
                    <div>
                        <form onSubmit={onSubmit}>
                            {/* Логин */}
                            <div>
                                <label>Логин:</label>
                                <div>
                                    <span>
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        name="login"
                                        value={login}
                                        onChange={onChange}
                                        required
                                        placeholder="Введите логин"
                                    />
                                </div>
                            </div>

                            {/* Пароль */}
                            <div>
                                <label>Пароль:</label>
                                <div>
                                    <span>
                                        <FaLock />
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        placeholder="Введите пароль"
                                    />
                                </div>
                            </div>

                            {/* Кнопка отправки */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        'Регистрируем...'
                                    ) : (
                                        <>
                                            <FaUserPlus />
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
