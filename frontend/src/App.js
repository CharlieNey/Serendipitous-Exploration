import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import ExplorePage from './components/ExplorePage';
import AboutPage from './components/AboutPage';
import CalendarPage from './components/CalendarPage';
import SlotMachine from './components/SlotMachine';
import GraphPage from './components/GraphPage';
import TestPage from './components/TestPage';
import { SavedCoursesProvider } from './components/SavedCoursesContext.js';
import { SearchProvider } from './components/SearchContext.js';
import { GraphProvider } from "./components/GraphContext";

const App = () => {
  return (
    <SavedCoursesProvider>
      <SearchProvider>
        <GraphProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/slot-machine" element={<SlotMachine />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/graph" element={<GraphPage />} />
              <Route path="/test-page" element={<TestPage />} />
            </Routes>
          </Router>
        </GraphProvider>
      </SearchProvider>
    </SavedCoursesProvider>
  );
};



export default App;
