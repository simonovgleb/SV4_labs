import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Blog extends React.Component {
    render() {
        return (
            <section className="py-5 bg-light" id="blog">
                <h2 className="visually-hidden">Blog</h2>
                <div className="container">
                    <div className="text-center mb-5">
                        <p className="text-primary fw-bold h3 lng-blog">Blog</p>
                        <p className="h4 lng-blog__second__title">Be First Who Read News</p>
                        <p className="text-muted lng-blog__second__about">
                            Explore the latest stories about our dishes, offers, events and future plans here.
                        </p>
                    </div>

                    <div className="row">
                        {/* Карточка блога */}
                        {[...Array(10)].map((_, index) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="position-relative">
                                        <img
                                            src={`./static/blog/${index + 1}.png`}
                                            alt={`blog img ${index + 1}`}
                                            className="card-img-top"
                                        />
                                        <button className="btn btn-primary position-absolute bottom-0 end-0 m-3 lng-blog__card__view__button">
                                            View More
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-2">
                                            <p className="text-primary fw-bold mb-1 lng-card__date__title">
                                                {["Delicious", "Cooking", "Family", "Desserts", "Cuisine", "Entertainment", "Health", "Drinks", "Promotions", "Events"][index]}
                                            </p>
                                            <p className="text-muted small lng-card__date__time">March {19 - index}, 2022</p>
                                        </div>
                                        <h5 className="card-title lng-blog__card__title">
                                            {[
                                                "The Legend of US Cuisine: The Story of Hungry People",
                                                "The Most Popular Delicious Food of Mediterranean Cuisine",
                                                "Family Fun Days",
                                                "Dessert Dreams",
                                                "Seafood Extravaganza",
                                                "Live Music Nights",
                                                "Vegan Delights",
                                                "Happy Hour Highlights",
                                                "Weekend Brunch Bash",
                                                "Chef's Table Experience"
                                            ][index]}
                                        </h5>
                                        <p className="card-text text-muted lng-blog__card__about">
                                            {[
                                                "Capitalize on low-hanging fruit to identify a ballpark value added matrix economically and the creative activity to beta test override the food quality.",
                                                "Strategies on low-hanging fruit to identify a ballpark value added matrix economically and the creative activity to beta test override the food quality.",
                                                "Bring the whole family for a fun day out at our restaurant! We offer kid-friendly menus and activities to keep the little ones entertained. Join us for Family Fun Days every Sunday!",
                                                "Satisfy your sweet tooth with our delectable desserts! From classic chocolate cake to innovative creations, there’s something for everyone. Don’t miss our Dessert of the Day special!",
                                                "Dive into our Seafood Extravaganza! We’re serving up the freshest catches, from lobster to oysters. Whether you’re a seafood lover or a first-timer, our dishes are sure to impress.",
                                                "Experience the best local talent at our Live Music Nights every Friday and Saturday. Enjoy great food, drinks, and live performances in a lively atmosphere. See you there!",
                                                "Calling all vegans! We’ve expanded our menu to include a variety of delicious and nutritious vegan options. Come and try our new Vegan Buddha Bowl – it’s as tasty as it is healthy.",
                                                "Unwind after a long day with our Happy Hour specials! Enjoy discounted drinks and appetizers from 5 PM to 7 PM every weekday. Cheers to good times and great deals!",
                                                "Our weekend brunch is back and better than ever! Indulge in a variety of delicious brunch items from savory to sweet. Don’t miss out on our bottomless mimosas!",
                                                "Join us for an exclusive Chef's Table experience! Enjoy a multi-course meal prepared right in front of you by our talented chef. Reserve your spot now for an unforgettable dining adventure."
                                            ][index]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Пагинация */}
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                            <li className="page-item disabled">
                                <a className="page-link" href="#">&laquo;</a>
                            </li>
                            <li className="page-item disabled">
                                <a className="page-link" href="#">&lt;</a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">1</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">&gt;</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">&raquo;</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
        );
    }
}
