import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Header extends React.Component {
  render() {
    return (
      <header>
        {/* Навигационная панель Bootstrap */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">


            {/* Логотип */}
            <Link className="navbar-brand" to="/">
              <img
                src="./static/LOGO.png"
                alt="logo"
                style={{ width: '240px', height: '140px' }}
                className="d-inline-block align-top"
              />
            </Link>

            {/* Кнопка "Reservation" справа, на широких экранах */}
            <div className="d-none d-lg-block">
              <a href="#book-table" className="btn btn-primary me-3">
                Reservation
              </a>
            </div>

            {/* Ссылка-заглушка с телефоном в левой части */}
            <a href="tel:123456789" className="navbar-text me-3">
              Call - 123 456 789
            </a>



            {/* Бургер-кнопка для мобильных устройств */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Выпадающее меню (бургер) */}
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/manage-dishes" className="nav-link">
                    Manage Dishes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/manage-reservations" className="nav-link">
                    Manage Reservations
                  </Link>
                </li>
              </ul>

              {/* Кнопка "Reservation" в выпадающем меню (отображается на мобильных) */}
              <div className="d-lg-none my-3">
                <a href="#book-table" className="btn btn-primary w-100">
                  Reservation
                </a>
              </div>

              {/* Соц. сети - можно разместить справа */}
              <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
                <img
                  src="./static/inst.png"
                  alt="Instagram"
                  style={{ width: '24px', height: '24px' }}
                  className="me-2"
                />
                <img
                  src="./static/facebook.png"
                  alt="Facebook"
                  style={{ width: '24px', height: '24px' }}
                  className="me-2"
                />
                <img
                  src="./static/twitter.png"
                  alt="Twitter"
                  style={{ width: '24px', height: '24px' }}
                  className="me-2"
                />
                <img
                  src="./static/pinterest.png"
                  alt="Pinterest"
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}