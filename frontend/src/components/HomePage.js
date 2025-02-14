import React from 'react';
import { Link } from 'react-router-dom';
import carleton_logo from '../images/carleton_logo.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src={carleton_logo} className="homepage-logo" alt="Carleton Logo" />
        <h1>
         Curriculum Exploration
        </h1>
        <br />
        <Link to="/graph">
          <button className="homepage-button">Get Started!</button>
        </Link>
        <br />
        <Link to="/about" className="learn-more-link">Learn more about this website</Link>
      </header>
    </div>
  );
};

export default HomePage;
