/**
 * @file HomePage.js
 * @description Creates website homepage.
 * @authors Cathy, Kai, Willow, Zoey
 * @date 3/12/25
 */

import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from 'react-router-dom';
import carleton_logo from '../images/home_pic.png';
import './HomePage.css';

const HomePage = ({ setShowNavbar }) => {
  const [picIsHovered, setPicIsHovered] = useState(false);

  /**
   * Set the navbar not to show on this page.
   * @return {void}
   */
  useEffect(() => {
    setShowNavbar(false);
  }, []);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
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
      </header>
    </div>
  );
};

export default HomePage;
