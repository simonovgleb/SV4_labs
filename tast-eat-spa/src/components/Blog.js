// src/components/Blog.js
import React from 'react';

export class Blog extends React.Component {
    render() {
        return (
            <section className="blog" id="blog">
                <h2 hidden>Blog</h2>
                <div className="container__max">
                    <div className="blog__content">
                        <p className="blog__first__title lng-blog">
                            Blog
                        </p>
                        <p className="blog__second__title lng-blog__second__title">
                            Be First Who Read News
                        </p>
                        <p className="blog__second__about lng-blog__second__about">
                            Explore the latest stories about our dishes, offers, events and future plans here.
                        </p>

                        <div className="blog__cards">
                            <div className="blog__card">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/first.png" 
                                      alt="blog img first" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title">
                                            Delicious
                                        </p>
                                        <p className="card__date__time lng-card__date__time">
                                            March 19, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title">
                                        The Legend of US Cuisine: The Story of Hungry People
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about">
                                        Capitalize on low-hanging fruit to identify a ballpark value added matrix economically and the creative activity to beta test override the food quality.
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/second.png" 
                                      alt="blog img second" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__2">
                                            Cooking
                                        </p>
                                        <p className="card__date__time lng-card__date__time__2">
                                            March 19, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__2">
                                        The Most Popular Delicious Food of Mediterranean Cuisine
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__2">
                                        Strategies on low-hanging fruit to identify a ballpark value added matrix economically and the creative activity to beta test override the food quality.
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/third.png" 
                                      alt="blog img third" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__3">
                                            Family
                                        </p>
                                        <p className="card__date__time lng-card__date__time__3">
                                            March 18, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__3">
                                        Family Fun Days
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__3">
                                        Bring the whole family for a fun day out at our restaurant! We offer kid-friendly menus and activities to keep the little ones entertained. Join us for Family Fun Days every Sunday!
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/fourth.png" 
                                      alt="blog img fourth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__4">
                                            Desserts
                                        </p>
                                        <p className="card__date__time lng-card__date__time__4">
                                            March 18, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__4">
                                        Dessert Dreams
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__4">
                                        Satisfy your sweet tooth with our delectable desserts! From classic chocolate cake to innovative creations, there’s something for everyone. Don’t miss our Dessert of the Day special!
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/fifth.png" 
                                      alt="blog img fifth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__5">
                                            Cuisine
                                        </p>
                                        <p className="card__date__time lng-card__date__time__5">
                                            March 17, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__5">
                                        Seafood Extravaganza
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__5">
                                        Dive into our Seafood Extravaganza! We’re serving up the freshest catches, from lobster to oysters. Whether you’re a seafood lover or a first-timer, our dishes are sure to impress.
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/sixth.png" 
                                      alt="blog img sixth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__6">
                                            Entertainment
                                        </p>
                                        <p className="card__date__time lng-card__date__time__6">
                                            March 15, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__6">
                                        Live Music Nights
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__6">
                                        Experience the best local talent at our Live Music Nights every Friday and Saturday. Enjoy great food, drinks, and live performances in a lively atmosphere. See you there!
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/seventh.png" 
                                      alt="blog img seventh" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__7">
                                            Health
                                        </p>
                                        <p className="card__date__time lng-card__date__time__7">
                                            March 12, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__7">
                                        Vegan Delights
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__7">
                                        Calling all vegans! We’ve expanded our menu to include a variety of delicious and nutritious vegan options. Come and try our new Vegan Buddha Bowl – it’s as tasty as it is healthy.
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/eighth.png" 
                                      alt="blog img eighth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__8">
                                            Drinks
                                        </p>
                                        <p className="card__date__time lng-card__date__time__8">
                                            March 10, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__8">
                                        Happy Hour Highlights
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__8">
                                        Unwind after a long day with our Happy Hour specials! Enjoy discounted drinks and appetizers from 5 PM to 7 PM every weekday. Cheers to good times and great deals!
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/nineth.png" 
                                      alt="blog img nineth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__9">
                                            Promotions
                                        </p>
                                        <p className="card__date__time lng-card__date__time__9">
                                            March 8, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__9">
                                        Weekend Brunch Bash
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__9">
                                        Our weekend brunch is back and better than ever! Indulge in a variety of delicious brunch items from savory to sweet. Don’t miss out on our bottomless mimosas!
                                    </p>
                                </div>
                            </div>

                            <div className="blog__card hidden">
                                <div className="blog__img__container">
                                    <img 
                                      src="./static/blog/tenth.png" 
                                      alt="blog img tenth" 
                                      className="blog__img" 
                                    />
                                    <button className="blog__card__view__button btn__animation lng-blog__card__view__button">
                                        View More
                                    </button>
                                </div>
                                <div className="blog__card__content">
                                    <div className="card__date__block">
                                        <p className="card__date__title lng-card__date__title__10">
                                            Events
                                        </p>
                                        <p className="card__date__time lng-card__date__time__10">
                                            March 5, 2022
                                        </p>
                                    </div>
                                    <p className="blog__card__title lng-blog__card__title__10">
                                        Chef's Table Experience
                                    </p>
                                    <p className="blog__card__about lng-blog__card__about__10">
                                        Join us for an exclusive Chef's Table experience! Enjoy a multi-course meal prepared right in front of you by our talented chef. Reserve your spot now for an unforgettable dining adventure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="blog__pagination">
                            <p className="blog__pagination__button disabled" id="blog-pagination-first-page">
                                &lt;&lt;
                            </p>
                            <p className="blog__pagination__button disabled" id="blog-pagination-prev-page">
                                &lt;
                            </p>
                            <p id="blog-pagination-page">1</p>
                            <p className="blog__pagination__button" id="blog-pagination-next-page">
                                &gt;
                            </p>
                            <p className="blog__pagination__button" id="blog-pagination-last-page">
                                &gt;&gt;
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        );
    }
}