// src/App.js
import React from 'react';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { MiniInfo } from './components/MiniInfo';
import { Dishes } from './components/Dishes';
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';

class App extends React.Component {
  render() {
    return (
      <div className="page__wrapper">
        <Header />
        <main className="content__of__page">
          <Welcome />
          <MiniInfo />
          <Dishes />
          <Blog />
          {/* Другие секции по необходимости */}
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;