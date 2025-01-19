// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Homepage } from './components/Homepage';
import { ManageDishes } from './components/ManageDishes/ManageDishes';
import { ManageReservations } from './components/ManageReservations/ManageReservations';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="page__wrapper">
          <Header />
          <main className="content__of__page">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/manage-dishes" element={<ManageDishes />} />
              <Route path="/manage-reservations" element={<ManageReservations />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
