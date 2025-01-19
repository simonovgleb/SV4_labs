import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Welcome extends React.Component {
    render() {
        return (
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Левая часть с текстом */}
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="display-4 text-primary fw-bold mb-3 lng-welcome-title">
                                Welcome to Restaurant
                            </h2>
                            <p className="lead text-muted lng-welcome-about">
                                The people, food and the prime locations make the perfect place for good friends &amp; family to come
                                together and have a great time.
                            </p>
                            <a href="#menu" className="btn btn-primary btn-lg lng-welcome-btn">
                                View Menu
                            </a>
                        </div>

                        {/* Правая часть с изображением */}
                        <div className="col-lg-6">
                            <div className="text-center">
                                <img
                                    src="./static/IMAGE.png"
                                    alt="restaurant"
                                    className="img-fluid rounded shadow-lg"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
