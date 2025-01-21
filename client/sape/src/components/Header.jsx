import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    const activeStyle = { fontWeight: 'bold', textDecoration: 'underline' };

    return (
        <header>
            <nav>
                <ul>
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
                </ul>
            </nav>
        </header>
    );
};

export default Header;