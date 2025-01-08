import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import ExplorePage from './components/ExplorePage';
import AboutPage from './components/AboutPage';
import CalendarPage from './components/CalendarPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/:id/:name" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
};



export default App;
