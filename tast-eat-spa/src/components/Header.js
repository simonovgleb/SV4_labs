// src/components/Header.js
import React from 'react';

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
          <div className="navbar__container">
            <nav>
              <ul className="header__navbar">
                <li className="header__btn">
                  <a href="./index.html" className="lng-home">Home</a>
                </li>
                <li className="header__btn">
                  <a href="#mini__info" className="header__btn__link lng-about__us">About Us</a>
                </li>
                <li className="header__btn">
                  <a href="#dishes" className="header__btn__link lng-menu">Our Menu</a>
                </li>
                <li className="header__btn">
                  <a href="#" className="header__btn__link lng-burger-pages">Pages</a>
                </li>
                <li className="header__btn">
                  <a href="#blog" className="header__btn__link lng-blog">Blog</a>
                </li>
                <li className="header__btn">
                  <a href="#footer" className="header__btn__link lng-contact">Contact Us</a>
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
        {/* Остальная часть Header (burger panel, aside и т.п.) аналогично включается */}
      </header>
    );
  }
}