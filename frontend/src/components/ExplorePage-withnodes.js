import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./ExplorePage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';

function Explore() {
  const [searchTerm, setSearchTerm] = useState("")
  // Mock dummy graph. Code adapted from d3indepth.com. only text, maybe go back to circle  with hover.
  const width = 1000;
  const height = 500;
    const nodes = [
      {name: 'SOAN111'},
      {name: 'SOAN110'},
      {name: 'STAT120'},
      {name: 'CS201'},
      {name: 'CAMS254'},
      {name: 'CHEM123'},
      {name: 'CGSC130'},
      {name: 'ECON265'}
    ]

    const links = [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 0, target: 3},
      {source: 6, target: 4},
      {source: 3, target: 5},
      {source: 3, target: 6},
      {source: 6, target: 7}
    ]

    useEffect(() => {
      const svg = d3
        .select("#simulation-svg")
        .attr("width", width)
        .attr("height", height);

      svg.append("g").attr("class", "links");
      svg.append("g").attr("class", "nodes");
    
      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink().links(links).distance(100)) 

        .on("tick", () => {
          d3.select(".links")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y)
            .attr("stroke", "black")
            .attr("stroke-width", 2);


        const nodeGroup = d3.select(".nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
      
        // creating the circles
        nodeGroup
          .selectAll("circle")
          .data((d) => [d]) 
          .join("circle")
          .attr("r", 40)
        
        // adding the text to the circles
        nodeGroup
          .selectAll("text")
          .data((d) => [d]) 
          .join("text")
          .text((d) => d.name)
          .attr("dy", 5)
        });
    
      return () => {
        simulation.stop();
        svg.selectAll(".links").remove();
        svg.selectAll(".nodes").remove();
      };
    }, [nodes, links]);
  

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

      <div className="simulation-container">
        <svg id="simulation-svg"></svg>
      </div>


    </div>
    
  );

  
}

export default Explore;
