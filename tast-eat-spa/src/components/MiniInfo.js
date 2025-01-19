// src/components/MiniInfo.js
import React from 'react';

export class MiniInfo extends React.Component {
    render() {
        return (
            <section className="mini__info" id="mini__info">
                <h2 hidden>Geolocation</h2>
                <div className="container__max">
                    <div className="mini__info__content">
                        <div className="mini__info__item">
                            <img src="./static/geolocation.png" alt="icons" className="mini__info__item__image" />
                            <div className="mini__info__item__text">
                                <p className="mini__info__item__title lng-mini__info__item__title__1">
                                    Locate Us
                                </p>
                                <p className="mini__info__item__about lng-mini__info__item__about__3">
                                    Riverside 25, San Diego, California
                                </p>
                            </div>
                        </div>
                        {/* Остальные элементы mini__info аналогично */}
                    </div>
                </div>
            </section>
        );
    }
}