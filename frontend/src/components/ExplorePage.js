import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./ExplorePage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");

  // dummy
  const courseList = [
    { id: "SOAN111", name: "Intro to Sociology" },
    { id: "SOAN110", name: "Intro to Anthropology" },
    { id: "STAT120", name: "Intro to Statistics" },
    { id: "CS201", name: "Data Structures" },
  ];

  const filteredCourses = searchTerm
    ? courseList.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="Explore">
      <div className="calendar-button">
        <Link to="/calendar">
            <img src={shopping_cart_logo} alt="Go to Calendar" />
        </Link>
      </div>

      <div className="sidebar">
        <div className="search-section">

          <input
            type="text"
            placeholder="input courses, topics,..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {searchTerm && (
            <ul className="course-list">
              {filteredCourses.map((course) => (
                <li key={course.id} className="course-item">
                  {course.id} - {course.name}
                  <Link to={`/calendar/${course.id}/${encodeURIComponent(course.name)}`} className="add-to-calendar-button">
                    <img src={shopping_cart_logo} alt="Add to Calendar" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="divider"></div>
      </div>
    </div>
  );
}

export default Explore;
