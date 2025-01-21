// src/components/Header.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- Импорт Bootstrap
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';

// React-icons
import {
    FaSignOutAlt,
    FaHome,
    FaUserPlus,
    FaUserLock,
    FaCashRegister,
} from 'react-icons/fa';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const activeStyle = { fontWeight: 'bold', textDecoration: 'underline' };

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Вы успешно вышли из системы');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                {/* Лого / Бренд */}
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <FaHome className="me-1" />
                    SAPE
                </Link>

                {/* Кнопка "гамбургер" для мобильных устройств */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Основной блок навигации */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* Если нет токена, значит пользователь не авторизован */}
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/register"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        <FaUserPlus className="me-1" />
                                        Регистрация пользователя
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/admin-register"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        <FaCashRegister className="me-1" />
                                        Регистрация администратора
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/login"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        <FaUserLock className="me-1" />
                                        Авторизация
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Ссылки, доступные только авторизованным */}
                                <li className="nav-item">
                                    <NavLink
                                        to="/employees"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Сотрудники
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/departments"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Отделы
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/contracts"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Договора
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/deliveries"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Поставки
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/organizations"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Организации
                                    </NavLink>
                                </li>

                                {/* Сменить пароль */}
                                <li className="nav-item">
                                    <NavLink
                                        to="/change-password"
                                        className="nav-link"
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                    >
                                        Сменить пароль
                                    </NavLink>
                                </li>

                                {/* Кнопка «Выйти» */}
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger ms-2"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="me-1" />
                                        Выйти
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
