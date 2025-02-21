//FROM: https://www.sitepoint.com/creating-a-navbar-in-react/

import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import home_icon from '../images/home.png';
import graph_icon from '../images/graph.png';
import quiz_icon from '../images/quiz.png';
import calendar_icon from '../images/calendar.png';
import about_icon from '../images/about.png';
import email_icon from '../images/email.png';

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
                    <li>
                        <div className="icon">
                            <Link to="/">
                                <img src={home_icon} alt="Go to Home" />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <Link to="/graph">
                                <img src={graph_icon} alt="Go to Graph" />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <Link to="/quiz">
                                <img src={quiz_icon} alt="Go to Quiz" />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <Link to="/calendar">
                                <img src={calendar_icon} alt="Go to Calendar" />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <Link to="/about">
                                <img src={about_icon} alt="Go to About" />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className="icon">
                            <Link to="/email">
                                <img src={email_icon} alt="Go to Email" />
                            </Link>
                        </div>
                    </li>
                    <Link to="https://docs.google.com/forms/d/e/1FAIpQLSduMonrUDplipblEWFjew5RhLfaCO3CzCmzmtxk7ynqgQn1yw/viewform?usp=sharing">
                        <li>Feedback</li>
                    </Link>
                </ul>
            </div>
            <div className="navbar-right"></div>
        </nav>
    );
};

export default Navbar;