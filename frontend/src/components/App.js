import logo from '../carleton_logo.png';
import './App.css';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Data from '../courses2.csv';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">

       
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1>CS399: Serendipitous Exploration of the Carleton Curriculum </h1>
//           <h3>Cathy Duan, Charlie Ney, Markus Gunadi, Kai Weiner, Zoey La, Willow Gu</h3>
    
        
//       </header>
//     </div>
//   );
// }

import { BrowserRouter, Route, Routes } from "react-router-dom";

import homePage from "../index";
import Calendar from "./calendar_page";
import About from "./about_us";

function App() {
//   <BrowserRouter>
//     <Routes>
//       <Route exact path="/" component={homePage} />
//       <Route path="/page2" component={Calendar} />
//       <Route path="/page3" component={About} />
//   </Routes>
//  </BrowserRouter>
  <Router>
      
  </Router>
}

export default App;
