import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Footer extends React.Component {
    render() {
        return (
            <footer className="bg-dark text-light py-5" id="footer">
                <div className="container">
                    {/* Верхняя часть: Логотип, хэштег и соцсети */}
                    <div className="text-center mb-5">
                        <p className="h5 text-uppercase text-primary mb-3">#TheTastEat</p>
                        <img src="./static/LOGO.png" alt="logo" className="mb-3" style={{ maxWidth: '150px' }} />
                        <div className="d-flex justify-content-center gap-3">
                            <img src="./static/inst.png" alt="Instagram" className="icon" style={{ width: '30px' }} />
                            <img src="./static/facebook.png" alt="Facebook" className="icon" style={{ width: '30px' }} />
                            <img src="./static/twitter.png" alt="Twitter" className="icon" style={{ width: '30px' }} />
                            <img src="./static/pinterest.png" alt="Pinterest" className="icon" style={{ width: '30px' }} />
                        </div>
                    </div>

                    {/* Средняя часть: Контактная информация, форма подписки и часы работы */}
                    <div className="row text-center text-lg-start mb-5">
                        {/* Контакты */}
                        <div className="col-lg-4 mb-4">
                            <h5 className="text-uppercase text-primary">Contact</h5>
                            <p>5 Rue Dalou, 75015 Paris</p>
                            <p>
                                <a href="tel:1234556" className="text-light">
                                    +123 456 789
                                </a>
                            </p>
                            <p>
                                <a href="mailto:josefin@mail.com" className="text-light">
                                    josefin@mail.com
                                </a>
                            </p>
                        </div>

                        {/* Форма подписки */}
                        <div className="col-lg-4 mb-4">
                            <h5 className="text-uppercase text-primary">Join Our Mailing List</h5>
                            <p>Get updates, news, and offers about events.</p>
                            <form action="javascript:void(0)" className="d-flex flex-column align-items-center">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Часы работы */}
                        <div className="col-lg-4 mb-4">
                            <h5 className="text-uppercase text-primary">Working Hours</h5>
                            <p>Mon – Fri: <span className="text-light">7:00am – 6:00pm</span></p>
                            <p>Sat: <span className="text-light">7:00am – 6:00pm</span></p>
                            <p>Sun: <span className="text-light">8:00am – 6:00pm</span></p>
                        </div>
                    </div>

                    {/* Нижняя часть: Копирайт и ссылки */}
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="text-center text-lg-start mb-3 mb-lg-0">
                            <p className="mb-0">
                                © Copyright - TastEat | Designed by{' '}
                                <span className="text-primary">VictorFlow</span> - Powered by{' '}
                                <span className="text-primary">Webflow</span> - Developed by{' '}
                                <a href="mailto:glebgithub@gmail.com" className="text-primary">Gleb</a>
                            </p>
                            <div className="d-flex gap-2 justify-content-center justify-content-lg-start">
                                <a href="mailto:glebgithub@gmail.com" className="text-light">
                                    <img alt="email" src="./static/footer/email-icon.svg" style={{ width: '20px' }} />
                                </a>
                                <a href="tel:+375294938430" className="text-light">
                                    <img alt="phone" src="./static/footer/phone-icon.svg" style={{ width: '20px' }} />
                                </a>
                                <a
                                    href="https://maps.app.goo.gl/hKrgJpeWySo14MFA7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light"
                                >
                                    <img alt="location" src="./static/footer/location-icon.svg" style={{ width: '20px' }} />
                                </a>
                                <a
                                    href="https://github.com/simonovgleb"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-light"
                                >
                                    <img alt="github" src="./static/footer/github-icon.svg" style={{ width: '20px' }} />
                                </a>
                            </div>
                        </div>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-light">Styleguide</a>
                            <a href="#" className="text-light">Licenses</a>
                            <a href="#" className="text-light">Protected</a>
                            <a href="#" className="text-light">Not Found</a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
