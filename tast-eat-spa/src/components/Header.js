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

        <div className="burger__panel">
          <div className="burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <aside className="burger__content">
          <img src="./static/LOGO.png" alt="logo" className="burger__logo" />
          <div className="burger__btns">
            <div className="burger__btn">
              <img src="./static/header/home.png" className="burger__btn__img" alt="home" />
              <a href="./index.html" className="lng-home">Home</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/information.png" className="burger__btn__img" alt="about us" />
              <a href="#mini__info" className="lng-about__us">About Us</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/burger.png" className="burger__btn__img" alt="our menu" />
              <a href="#dishes" className="lng-burger-menu">Our Menu</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/web-browser.png" className="burger__btn__img" alt="pages" />
              <a href="#" className="lng-burger-pages">Pages</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/paper.png" className="burger__btn__img" alt="blog" />
              <a href="#blog" className="lng-burger-blog">Blog</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/contact-us.png" className="burger__btn__img" alt="contact us" />
              <a href="#footer" className="lng-burger-contact">Contact Us</a>
            </div>
            <div className="burger__btn">
              <img src="./static/header/phone.png" className="burger__btn__img" alt="call" />
              <a href="tel:1234" className="lng-burger-tel">Call - 123 456 789</a>
            </div>
            <div className="burger__btn">
              <a href="./#book-table" className="lng-burger-reservation">Reservation</a>
            </div>
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