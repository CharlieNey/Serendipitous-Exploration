import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import ExplorePage from './components/ExplorePage';
import AboutPage from './components/AboutPage';
import CalendarPage from './components/CalendarPage';
import GraphPage from './components/GraphPage';
import { GraphProvider } from "./components/GraphContext";

const App = () => {
  return (
    <GraphProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calendar/:id/:name" element={<CalendarPage />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </Router>
    </GraphProvider>
  );
};



export default App;
