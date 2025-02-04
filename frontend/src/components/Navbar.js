//FROM: https://www.sitepoint.com/creating-a-navbar-in-react/

import React from 'react';
import './Navbar.css';

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
                <a href="/">Home</a>
                </li>
            <li>
                <a href="/slot-machine">Slot Machine</a>
                </li>
                <li>
                <a href="/graph">Graph</a>
                </li>
                <li>
                <a href="/calendar">Calendar</a>
                </li>
                <li>
                <a href="/about">About</a>
                </li>
            </ul>
            </div>
            <div className="navbar-right">
            </div>
        </nav>
    );
};

export default Navbar;