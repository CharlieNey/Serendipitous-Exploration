import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from 'react-router-dom';
// import carleton_logo from '../images/carleton_logo.png';
import carleton_logo from '../images/home_pic.png';
import './HomePage.css';

const HomePage = ({ setShowNavbar }) => {
  const [picIsHovered, setPicIsHovered] = useState(false);

  useEffect(() => {
    setShowNavbar(false);
  }, []);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        {/* <img src={carleton_logo} className="homepage-logo" alt="Carleton Logo" /> */}
        <h1>
         Serendipitous Curriculum Exploration
        </h1>
        <Link to="/graph">
          <button
            style={{ backgroundColor: 'rgb(139, 153, 181)', border: 'none', cursor: 'pointer'}}
            onMouseEnter={() => setPicIsHovered(true)}
            onMouseLeave={() => setPicIsHovered(false)}
          >
            <img src={carleton_logo} className="homepage-logo" alt="Carleton Logo" />
          </button>
        </Link>
        <br />
        <Link to="/graph">
          <button className="homepage-button" style={{backgroundColor: picIsHovered ? '#FFD24F' : '',}}>
            Explore Course Connections
          </button>
        </Link>
        <br />
        <Link to="/quiz">
          <button className="homepage-button">Find Your Course Quest</button>
        </Link>
        <br />
        <Link to="/about">
          <button className="homepage-button">What Is This Website?</button>
        </Link>
        <br />
        <Link to="https://docs.google.com/forms/d/e/1FAIpQLSduMonrUDplipblEWFjew5RhLfaCO3CzCmzmtxk7ynqgQn1yw/viewform?usp=sharing">
          <button className="homepage-button">Give Feedback</button>
        </Link>
        <br />
        {/* <Link to="/about" className="learn-more-link">Learn more about this website</Link> */}
      </header>
    </div>
  );
};

export default HomePage;
