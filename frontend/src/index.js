import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter, Route, Routes, Router } from "react-router-dom";


// import Homepage from "./components/HomePage";
// import Calendar from "./components/CalendarPage";
// import About from "./components/AboutPage";


// const root = ReactDOM.createRoot(document.getElementById('root'));

// const homePage = () => {
//   return (
//     <p>This is the homepage</p>
//   )
// }
// root.render(
//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>
// //   <BrowserRouter>
// //     <Routes>
// //       <Route exact path="/" component={root} />
// //       <Route path="/page2" component={Calendar} />
// //       <Route path="/page3" component={About} />
// //   </Routes>
// //  </BrowserRouter>,
//   <Router>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/home" element={<Homepage />} />
//         <Route path= "/calendar" element={<Calendar/>} />
//         <Route path="/about-us" element={<About />} />
//       </Routes>
//     </Router>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
