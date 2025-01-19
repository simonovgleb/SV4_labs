// src/components/Footer.js
import React from 'react';

export class Footer extends React.Component {
    render() {
        return (
            <footer className="footer" id="footer">
                <div className="container__max">
                    <div className="footer__preview">
                        <p className="footer__hashtag">
                            #TheTastEat
                        </p>
                        <img 
                          src="./static/LOGO.png" 
                          alt="logo" 
                          className="footer__preview__logo" 
                        />
                        <div className="footer__networks">
                            <img src="./static/inst.png" alt="social network" className="icon" />
                            <img src="./static/facebook.png" alt="social network" className="icon" />
                            <img src="./static/twitter.png" alt="social network" className="icon" />
                            <img src="./static/pinterest.png" alt="social network" className="icon" />
                        </div>
                    </div>

                    <div className="footer__titles">
                        <div className="footer__titles__element">
                        </div>
                        <div className="footer__titles__element lng-footer-title">
                            Join our mailing list for updates,
                            Get news &amp; offers events.
                        </div>
                        <div className="footer__titles__element">
                            <p className="footer__working__hours lng-footer-wh">
                                Working Hours
                            </p>
                        </div>
                    </div>

                    <div className="footer__main">
                        <div className="footer__main__element">
                            <p className="footer__main__element__title lng-footer-contact">
                                Contact
                            </p>
                            <p className="footer__main__element__subtitle lng-footer-st">
                                5 Rue Dalou, 75015 Paris
                            </p>
                            <p className="footer__main__element__email">
                                <a href="tel:1234556">
                                    +123 456 789
                                </a>
                            </p>
                            <p className="footer__main__element__tel">
                                <a href="mailto:test@mail.ru">
                                    josefin@mail.com
                                </a>
                            </p>
                        </div>

                        <div className="footer__main__element">
                            <form action="javascript:void(0)" className="footer__main__element__form">
                                <div className="footer__main__element__form__content">
                                    <input 
                                      type="text" 
                                      className="footer__main__element__input" 
                                      placeholder="Email" 
                                      required 
                                    />
                                    <button 
                                      type="submit"
                                      className="footer__main__element__form__btn lng-footer-sbs btn__animation"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="footer__main__element">
                            <div className="footer__main__element__days">
                                <div className="footer__main__element__day">
                                    <p className="footer__main__element__day__left lng-footer-m-f">
                                        Mon – Fri:
                                    </p>
                                    <p className="footer__main__element__day__right lng-footer-m-f-time">
                                        7.00am – 6.00pm
                                    </p>
                                </div>
                                <div className="footer__main__element__day">
                                    <p className="footer__main__element__day__left lng-footer-sat">
                                        Sat:
                                    </p>
                                    <p className="footer__main__element__day__right lng-footer-sat-time">
                                        7.00am – 6.00pm
                                    </p>
                                </div>
                                <div className="footer__main__element__day">
                                    <p className="footer__main__element__day__left lng-footer-sun">
                                        Sun:
                                    </p>
                                    <p className="footer__main__element__day__right lng-footer-sun-time">
                                        8.00am – 6.00pm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer__copyright">
                        <div className="footer__copyright__left">
                            <span className="footer__copyright__white lng-footer-copyright">
                                © Copyright - TastEat | Designed by
                            </span>
                            <span className="footer__copyright__orange lng-footer-victorflow">
                                VictorFlow
                            </span>
                            <span className="footer__copyright__white lng-footer-powered">
                                - Powered by
                            </span>
                            <span className="footer__copyright__orange lng-footer-webflow">
                                Webflow
                            </span>
                            <span className="footer__copyright__white lng-footer-developed">
                                - Developed by
                            </span>
                            <a href="mailto:glebgithub@gmail.com">
                                <img alt="email" src="./static/footer/email-icon.svg" />
                            </a>
                            <a href="tel:+375294938430">
                                <img alt="phone" src="./static/footer/phone-icon.svg" />
                            </a>
                            <a href="https://maps.app.goo.gl/hKrgJpeWySo14MFA7" target="_blank" rel="noopener noreferrer">
                                <img alt="location" src="./static/footer/location-icon.svg" />
                            </a>
                            <a href="https://github.com/simonovgleb" target="_blank" rel="noopener noreferrer">
                                <img alt="github" src="./static/footer/github-icon.svg" />
                            </a>
                        </div>
                        <div className="footer__copyright__right">
                            <div className="footer__copyright__item lng-footer-styleguide">
                                Styleguide
                            </div>
                            <div className="footer__copyright__item lng-footer-licences">
                                Licenses
                            </div>
                            <div className="footer__copyright__item lng-footer-protected">
                                Protected
                            </div>
                            <div className="footer__copyright__item lng-footer-not">
                                Not Found
                            </div>
                        </div>
                    </div>

                </div>
            </footer>
        );
    }
}
