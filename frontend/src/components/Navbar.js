//FROM: https://www.sitepoint.com/creating-a-navbar-in-react/

import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import shopping_cart_logo from '../images/shopping_cart_logo.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
            <a href="/" className="logo">
                Serendipitous Exploration
            </a>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    <Link to="/">
                        <li>Home</li>
                    </Link>
                    <Link to="/graph">
                        <li>Graph</li>
                    </Link>
                    <Link to="/quiz">
                        <li>Quiz</li>
                    </Link>
                    <Link to="/email">
                        <li>Email</li>
                    </Link>
                    <Link to="/about">
                        <li>About</li>
                    </Link>
                </ul>
                <div className="calendar-button">
                    <Link to="/calendar">
                    <img src={shopping_cart_logo} alt="Go to Calendar" />
                    </Link>
                </div>
            </div>
            <div className="navbar-right"></div>
        </nav>
    );
};

export default Navbar;