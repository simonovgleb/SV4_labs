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
                            {/* Полная структура карточек блога из HTML */}
                        </div>
                        <div className="blog__pagination">
                            <p className="blog__pagination__button disabled" id="blog-pagination-first-page">&lt;&lt;</p>
                            <p className="blog__pagination__button disabled" id="blog-pagination-prev-page">&lt;</p>
                            <p id="blog-pagination-page">1</p>
                            <p className="blog__pagination__button" id="blog-pagination-next-page">&gt;</p>
                            <p className="blog__pagination__button" id="blog-pagination-last-page">&gt;&gt;</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}