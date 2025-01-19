// src/components/Welcome.js
import React from 'react';

export class Welcome extends React.Component {
    render() {
        return (
            <section className="welcome">
                <div className="container__max">
                    <div className="welcome__content">
                        <div className="welcome__left">
                            <h2 className="welcome__title lng-welcome-title">
                                Welcome to Restaurant
                            </h2>
                            <h3 className="welcome__about lng-welcome-about">
                                The people, food and the prime locations make the perfect place good friends &amp; family to
                                come together and have great time.
                            </h3>
                            <button className="welcome__btn lng-welcome-btn btn__animation">
                                View Menu
                            </button>
                        </div>
                        <div className="welcome__right">
                            <div className="welcome__right__container">
                                <img src="./static/IMAGE.png" alt="restaurant" className="welcome__right__image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}