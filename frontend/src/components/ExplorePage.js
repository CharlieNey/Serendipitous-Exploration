import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./ExplorePage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");

  //for the graph
  const width = 1000;
  const height = 300;
  const nodes = [{}, {}, {}, {}, {}];


  useEffect(() => {
    // Select the SVG and set up the D3 force simulation
    const svg = d3
      .select("#simulation-svg")
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", () => {
        svg
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", 5)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
      });

    // Cleanup simulation on component unmount
    return () => {
      simulation.stop();
    };
  }, [nodes]);


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


      {/* SVG container for the force simulation */}
      <div className="simulation-container">
        <svg id="simulation-svg"></svg>
      </div>


    </div>
    
  );

  
}

export default Explore;
