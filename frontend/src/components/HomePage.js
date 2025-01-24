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
        <Link to="/explore">
          <button className="homepage-button">Start!</button>
        </Link>
        <br />
        <Link to="/graph">
          <button className="graphpage-button">Graph!</button>
        </Link>
        <br />
        <Link to="/test-page">
          <button className="graphpage-button">Test!</button>
        </Link>
        <br />
        <Link to="/about" className="learn-more-link">Learn more about this website</Link>
      </header>
    </div>
  );
};

export default HomePage;
