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
                        <img src="./static/LOGO.png" alt="logo" className="footer__preview__logo" />
                        <div className="footer__networks">
                            <img src="./static/inst.png" alt="social network" className="icon" />
                            <img src="./static/facebook.png" alt="social network" className="icon" />
                            <img src="./static/twitter.png" alt="social network" className="icon" />
                            <img src="./static/pinterest.png" alt="social network" className="icon" />
                        </div>
                    </div>
                    {/* Остальная часть футера, включая footer__titles, footer__main и copyright */}
                </div>
            </footer>
        );
    }
}