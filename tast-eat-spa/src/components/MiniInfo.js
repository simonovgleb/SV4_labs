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
                            <img
                                src="./static/geolocation.png"
                                alt="icons"
                                className="mini__info__item__image"
                            />
                            <div className="mini__info__item__text">
                                <p className="mini__info__item__title lng-mini__info__item__title__1">
                                    Locate Us
                                </p>
                                <p className="mini__info__item__about lng-mini__info__item__about__3">
                                    Riverside 25, San Diego, California
                                </p>
                            </div>
                        </div>

                        <div className="mini__info__item">
                            <img
                                src="./static/speed.png"
                                alt="icons"
                                className="mini__info__item__image"
                            />
                            <div className="mini__info__item__text">
                                <p className="mini__info__item__title lng-mini__info__item__title__2">
                                    Open Hours
                                </p>
                                <p className="mini__info__item__about lng-mini__info__item__about__2">
                                    Mon To Fri 9:00 AM - 9:00 PM
                                </p>
                            </div>
                        </div>

                        <div className="mini__info__item">
                            <img
                                src="./static/notebook.png"
                                alt="icons"
                                className="mini__info__item__image"
                            />
                            <div className="mini__info__item__text">
                                <p className="mini__info__item__title lng-mini__info__item__title__3">
                                    Reservation
                                </p>
                                <p className="mini__info__item__about">
                                    restaurantate@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}