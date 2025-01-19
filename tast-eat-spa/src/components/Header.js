// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

export class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <div className="container__max">
          <div className="header__preview">
            <div className="header__preview__button__left btn__animation">
              <a href="tel:123456789" className="lng-tel">Call - 123 456 789</a>
            </div>
            <div className="header__preview__logo">
              <img src="./static/LOGO.png" alt="logo" className="header__preview__image" />
            </div>
            <div className="header__preview__button__right btn__animation">
              <a href="./#book-table" className="lng-reservation">Reservation</a>
            </div>
          </div>

          {/* Обновлённая навигация */}
          <div className="navbar__container">
            <nav>
              <ul className="header__navbar">
                <li className="header__btn">
                  <Link to="/" className="lng-home">Home</Link>
                </li>
                <li className="header__btn">
                  <Link to="/manage-dishes" className="lng-manage-dishes">Manage Dishes</Link>
                </li>
                <li className="header__btn">
                  <Link to="/manage-reservations" className="lng-manage-reservations">Manage Reservations</Link>
                </li>
              </ul>
            </nav>
            <div className="header__navbar__networks">
              <img src="./static/inst.png" alt="social network" className="header__network icon" />
              <img src="./static/facebook.png" alt="social network" className="header__network icon" />
              <img src="./static/twitter.png" alt="social network" className="header__network icon" />
              <img src="./static/pinterest.png" alt="social network" className="header__network icon" />
            </div>
          </div>
        </div>

        <div className="burger__panel">
          <div className="burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Упрощённое содержимое бургер-меню */}
        <aside className="burger__content">
          <img src="./static/LOGO.png" alt="logo" className="burger__logo" />
          <div className="burger__btns">
            <div className="burger__btn">
              <img src="./static/header/home.png" className="burger__btn__img" alt="home" />
              <Link to="/" className="lng-home">Home</Link>
            </div>
            <div className="burger__btn">
              <img src="./static/header/dishes.png" className="burger__btn__img" alt="manage dishes" />
              <Link to="/manage-dishes" className="lng-manage-dishes">Manage Dishes</Link>
            </div>
            {/* Остальные кнопки удалены или закомментированы */}
          </div>
          <div className="header__navbar__networks">
            <img src="./static/inst.png" alt="social network" className="header__network" />
            <img src="./static/facebook.png" alt="social network" className="header__network" />
            <img src="./static/twitter.png" alt="social network" className="header__network" />
            <img src="./static/pinterest.png" alt="social network" className="header__network" />
          </div>
        </aside>
      </header>
    );
  }
}
