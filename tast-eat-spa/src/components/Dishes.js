// src/components/Dishes.js
import React from 'react';

export class Dishes extends React.Component {
    render() {
        return (
            <section className="dishes" id="dishes">
                <div className="container__max">
                    <h3 className="dishes__menu lng-dishes__menu">
                        MENU
                    </h3>
                    <div className="dishes__content">
                        <div className="dishes__left">
                            <p className="dishes__left__title lng-dishes__left__title">
                                Try Our Special dishes
                            </p>
                            <p className="dishes__left__about lng-dishes__left__about">
                                Every time you perfectly dine with us, it should happy for great inspired food in an environment designed with individual touches unique to the local area.
                            </p>
                            <img src="./static/dish.png" alt="dish" className="dishes__left__image" />
                            <button className="dishes__left__button lng-dishes__left__button btn__animation">
                                See all dishes
                            </button>
                        </div>
                        <div className="dishes__right">
                            <div className="dishes__right__item">
                                <p className="dishes__right__title lng-dishes__right__title1">
                                    Starters
                                </p>
                                <div className="dishes__elements">
                                    {/* Здесь можно динамически рендерить список блюд для раздела Starters */}
                                </div>
                            </div>

                            <div className="dishes__right__item">
                                <p className="dishes__right__title lng-dishes__right__title2">
                                    Main Dish
                                </p>
                                <div className="dishes__elements">
                                    {/* Здесь можно динамически рендерить список блюд для раздела Main Dish */}
                                </div>
                            </div>

                            <div className="dishes__right__item">
                                <p className="dishes__right__title lng-dishes__right__title3">
                                    Desert
                                </p>
                                <div className="dishes__elements">
                                    {/* Здесь можно динамически рендерить список блюд для раздела Desert */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
