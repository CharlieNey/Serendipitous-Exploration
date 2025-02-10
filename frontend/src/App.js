import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import AboutPage from './components/AboutPage';
import CalendarPage from './components/CalendarPage';
import SlotMachine from './components/SlotMachine';
import GraphPage from './components/GraphPage';
import QuizPage from './components/Quiz/QuizPage';
import EmailPage from './components/EmailPage';
import { SavedCoursesProvider } from './components/SavedCoursesContext.js';
import { SearchProvider } from './components/SearchContext.js';
import { GraphProvider } from "./components/GraphContext";
import Navbar from './components/Navbar';

const App = () => {
  // From https://stackoverflow.com/questions/76942172/in-react-how-to-have-a-navbar-on-specific-pages-only
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <SavedCoursesProvider>
      <SearchProvider>
        <GraphProvider>
          <Router>
          {showNavbar && <Navbar />}
            <Routes>
              <Route path="/" element={<HomePage setShowNavbar={setShowNavbar}/>} />
              <Route path="/about" element={<AboutPage setShowNavbar={setShowNavbar}/>} />
              <Route path="/slot-machine" element={<SlotMachine setShowNavbar={setShowNavbar}/>} />
              <Route path="/calendar" element={<CalendarPage setShowNavbar={setShowNavbar}/>} />
              <Route path="/graph" element={<GraphPage setShowNavbar={setShowNavbar}/>} />
              <Route path="/quiz" element={<QuizPage setShowNavbar={setShowNavbar}/>} />
              <Route path="/email" element={<EmailPage setShowNavbar={setShowNavbar}/>} />
            </Routes>
          </Router>
        </GraphProvider>
      </SearchProvider>
    </SavedCoursesProvider>
  );
};



export default App;
