import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class MiniInfo extends React.Component {
    render() {
        return (
            <section className="py-5 bg-light" id="mini__info">
                <h2 className="visually-hidden">Geolocation</h2>
                <div className="container">
                    <div className="row text-center">
                        {/* Первый элемент: Locate Us */}
                        <div className="col-md-4 mb-4">
                            <div className="d-flex flex-column align-items-center">
                                <img
                                    src="./static/geolocation.png"
                                    alt="Locate Us"
                                    className="mb-3"
                                    style={{ width: '50px', height: '50px' }}
                                />
                                <h4 className="text-primary fw-bold lng-mini__info__item__title__1">
                                    Locate Us
                                </h4>
                                <p className="text-muted lng-mini__info__item__about__3">
                                    Riverside 25, San Diego, California
                                </p>
                            </div>
                        </div>

                        {/* Второй элемент: Open Hours */}
                        <div className="col-md-4 mb-4">
                            <div className="d-flex flex-column align-items-center">
                                <img
                                    src="./static/speed.png"
                                    alt="Open Hours"
                                    className="mb-3"
                                    style={{ width: '50px', height: '50px' }}
                                />
                                <h4 className="text-primary fw-bold lng-mini__info__item__title__2">
                                    Open Hours
                                </h4>
                                <p className="text-muted lng-mini__info__item__about__2">
                                    Mon To Fri 9:00 AM - 9:00 PM
                                </p>
                            </div>
                        </div>

                        {/* Третий элемент: Reservation */}
                        <div className="col-md-4 mb-4">
                            <div className="d-flex flex-column align-items-center">
                                <img
                                    src="./static/notebook.png"
                                    alt="Reservation"
                                    className="mb-3"
                                    style={{ width: '50px', height: '50px' }}
                                />
                                <h4 className="text-primary fw-bold lng-mini__info__item__title__3">
                                    Reservation
                                </h4>
                                <p className="text-muted">
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
