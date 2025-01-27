import React, { useState, useEffect, useContext } from "react";
import * as d3 from "d3";
import { zoom } from 'd3-zoom';
import { select, selectAll } from 'd3-selection';
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

function getNodeColor(node, selectedNode) {
  if (node === selectedNode) {
    return "red";
  }
  return "pink";
}

const GraphPage = () => {
  // Mock dummy graph. Code adapted from d3indepth.com. 
  const graphWidth = 750;
  const graphHeight = 750;

  // Import state variables and fetching methods
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, setSelectedNode, fetchNodes, fetchLinks } = useContext(GraphContext);
  
  // Fetch values for state variables
  useEffect(() => {
    fetchNodes();
    fetchLinks();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const color = d3.scaleSequential(d3.interpolatePuBuGn);


  // Create graph
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0) return;

    const svg = d3
      .select("#simulation-svg")
      .attr("width", "100%")
      .attr("height", "100%")
      // .call(d3.zoom().scaleExtent([0.5,3]).on("zoom", (event) => {
      //   svg.attr("transform", event.transform);
      // }));



    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-10)) // spreads nodes apart
    .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2)) // location on page
    .force("link", d3.forceLink(links).id(d => d.id).distance(10)) // links nodes together
      //.force("collision", d3.forceCollide().radius(10)) // so nodes don't overlap-- but makes the graph kind of crazy 

    .on("tick", () => {
      d3.select(".links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
        .style("stroke", (d) => color((d.score - 0.5) * 2)) // Change to min similarity score
        .style("stroke-width", 2);

      const nodeGroup = d3.select(".nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      svg.selectAll(".links").remove();
      svg.selectAll(".nodes").remove();
    };
  }, [nodes, links, graphWidth, graphHeight]);

  useEffect(() => {
    const svg = d3
    .select("#simulation-svg")
    // .call(d3.zoom().on("zoom", (event) => {
    //   svg.attr("transform", event.transform);
    // }));

    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")

    nodeGroup
        .selectAll("circle")
        .data((d) => [d])
        .join("circle")
        .style("r", 5)
        .style("fill", (d) => getNodeColor(d.id, selectedNode))
        .style("stroke-width", 0.5)
        .style("stroke", "black");

      selectAll('circle')
        // .on('click', function (e, d) {
        //   setSelectedNode(d.id);
        // });
        .on('mouseover', function (e, d) {
          // d.style("fill", "green")
          setSelectedNode(d.id);
        })
        .on('mouseout', function (e, d) {
          setSelectedNode("");
        })

      // Adding the text to the circles
      nodeGroup
        .selectAll("text")
        .data((d) => [d])
        .join("text")
        .text((d) => d.id)
        .attr("dy", 1);
      });

  

  return (
    <div className="GraphPage">
      <div className="calendar-button">
        <Link to="/calendar">
          <img src={shopping_cart_logo} alt="Go to Calendar" />
        </Link>
      </div>
  
      <div className="content-container">
        <div className="scroll-sidebar">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by course name, description, or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
  
            {isLoading ? (
              <p>Loading courses...</p>
            ) : searchTerm && courseList.length === 0 ? (
              <p>No courses found matching your search.</p>
            ) : (
            <ul className="course-list">
              {courseList.map((course) => (
                <li 
                  key={course.course_number} 
                  className="course-item"
                  onClick={() => setSelectedNode(course.course_number)}  // update selected node when clicked
                  style={{ cursor: 'pointer' }}  
                >
                  <button
                    onClick={(e) => {
                      setSavedCourses((prevCourses) => {
                        const updatedCourses = [...prevCourses, course];
                        console.log(updatedCourses);
                        return updatedCourses;
                      });
                    }}
                    className="add-to-calendar-button"
                  >
                    <img src={shopping_cart_logo} alt="Add to Calendar" />
                  </button>

                  <div className="course-summary">
                    <strong>{course.course_number}:</strong> {course.course_title}
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>
  
        <div className="simulation-container" >
          <svg id="simulation-svg"></svg>
        </div>
      </div>
    </div>
  );
}

export default GraphPage;
