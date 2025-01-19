import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Dishes extends React.Component {
    render() {
        return (
            <section className="py-5 bg-light" id="dishes">
                <div className="container">
                    {/* Заголовок меню */}
                    <h3 className="text-center text-primary fw-bold mb-5 lng-dishes__menu">
                        MENU
                    </h3>

                    <div className="row">
                        {/* Левая часть: Описание и изображение */}
                        <div className="col-lg-6 mb-4">
                            <h4 className="fw-bold text-primary lng-dishes__left__title">
                                Try Our Special Dishes
                            </h4>
                            <p className="text-muted lng-dishes__left__about">
                                Every time you perfectly dine with us, it should be a happy moment for great inspired food in an
                                environment designed with individual touches unique to the local area.
                            </p>
                            <img
                                src="./static/dish.png"
                                alt="dish"
                                className="img-fluid rounded shadow-lg my-3"
                            />
                            <a href="#all-dishes" className="btn btn-primary btn-lg lng-dishes__left__button">
                                See all dishes
                            </a>
                        </div>

                        {/* Правая часть: Разделы меню */}
                        <div className="col-lg-6">
                            {/* Раздел Starters */}
                            <div className="mb-4">
                                <h5 className="text-primary fw-bold lng-dishes__right__title1">Starters</h5>
                                <ul className="list-group">
                                    {/* Здесь можно динамически рендерить список блюд */}
                                    <li className="list-group-item">Starter 1</li>
                                    <li className="list-group-item">Starter 2</li>
                                    <li className="list-group-item">Starter 3</li>
                                </ul>
                            </div>

                            {/* Раздел Main Dish */}
                            <div className="mb-4">
                                <h5 className="text-primary fw-bold lng-dishes__right__title2">Main Dish</h5>
                                <ul className="list-group">
                                    {/* Здесь можно динамически рендерить список блюд */}
                                    <li className="list-group-item">Main Dish 1</li>
                                    <li className="list-group-item">Main Dish 2</li>
                                    <li className="list-group-item">Main Dish 3</li>
                                </ul>
                            </div>

                            {/* Раздел Desert */}
                            <div>
                                <h5 className="text-primary fw-bold lng-dishes__right__title3">Desert</h5>
                                <ul className="list-group">
                                    {/* Здесь можно динамически рендерить список блюд */}
                                    <li className="list-group-item">Desert 1</li>
                                    <li className="list-group-item">Desert 2</li>
                                    <li className="list-group-item">Desert 3</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
