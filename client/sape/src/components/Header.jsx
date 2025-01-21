// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

// React-icons
import {
    FaSignOutAlt,
    FaHome,
    FaUserPlus,
    FaUserLock,
    FaCashRegister
} from 'react-icons/fa';

const Header = () => {
    const activeStyle = { fontWeight: 'bold', textDecoration: 'underline' };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Вы успешно вышли из системы');
        navigate('/login');
    };

    return (
        <nav>
            <div>
                {/* Бренд и логотип */}
                <Link to="/">
                    <FaHome />
                    SAPE
                </Link>

                {/* Основной блок навигации */}
                <div>
                    <ul>
                        {/* Если нет token, значит пользователь не авторизован */}
                        {!token ? (
                            <>
                                <li>
                                    <Link to="/register">
                                        <FaUserPlus />
                                        Регистрация пользователя
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin-register">
                                        <FaCashRegister />
                                        Регистрация администратора
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <FaUserLock />
                                        Авторизация
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/employees" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Сотрудники
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/departments" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Отделы
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/contracts" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Договора
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/deliveries" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Поставки
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/organizations" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Организации
                                    </NavLink>
                                </li>

                                {/* Кнопка «Выйти» */}
                                <li>
                                    <button>
                                        <li>
                                            <NavLink to="/change-password" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                                Сменить пароль
                                            </NavLink>
                                        </li>
                                    </button>
                                    <button onClick={handleLogout}>
                                        <FaSignOutAlt />
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
