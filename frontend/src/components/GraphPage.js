import React, { useState, useEffect, useContext } from "react";
import * as d3 from "d3";
import { select, selectAll } from 'd3-selection';
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

function getConnectedNodes(links, node) {
  var connectedNodes = []
  for (var i in links) {
    if (links[i].source.id === node) {
      connectedNodes.push(links[i].target.id)
    } else if (links[i].target.id === node){
      connectedNodes.push(links[i].source.id)
    }
  }
  return connectedNodes
}

function getLinkOpacity(link, selectedNode) {
  if(selectedNode === "" || link.source.id === selectedNode || link.target.id === selectedNode ) {
    return 1;
  }
  return 0.05;
}

function getNodeOpacity(node, selectedNode, connectedNodes) {
  if (selectedNode === "" || node === selectedNode || connectedNodes.includes(node)) {
    return 1;
  }
  return 0.5;
}

function getNodeColor(node, selectedNode, connectedNodes) {
  if (node === selectedNode) {
    return "red";
  } else if (connectedNodes.includes(node)){
    return "green";
  }
  return "pink";
}

const GraphPage = () => {
  // Mock dummy graph. Code adapted from d3indepth.com. Only text, maybe go back to circle with hover.
  const width = 1500;
  const height = 1500;

  // Import state variables and fetching methods
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, setSelectedNode, fetchNodes, fetchLinks } = useContext(GraphContext);
  const [clicked, setClicked] = useState(false)
  
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
    .attr("width", width)
    .attr("height", height)
  
  svg.append("g").attr("class", "links");
  svg.append("g").attr("class", "nodes");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-10)) // spreads nodes apart
    .force("center", d3.forceCenter(width / 2, height / 2)) // location on page
    .force("link", d3.forceLink(links).id(d => d.id).distance(10)) // links nodes together

    .on("tick", () => {
      const linksGroup = d3.select(".links")
        .selectAll("line")
        .data(links)
        .join("line")

      const nodeGroup = d3.select(".nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      linksGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    });

    return () => {
      simulation.stop();
    };
  }, [links, nodes]);



  useEffect(() => {
    const svg = d3
      .select("#simulation-svg")
      .call(d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      }));

    const linksGroup = d3.select(".links")
    .selectAll("line")
    .data(links)
    .join("line")

  linksGroup
    .style("opacity", (d) => getLinkOpacity(d, selectedNode))
    .style("stroke", (d) => color((d.score - 0.5) * 2)) // Change to min similarity score
    .style("stroke-width", 2)

    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")

    var connectedNodes = getConnectedNodes(links, selectedNode)
    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 5)
      .style("fill", (d) => getNodeColor(d.id, selectedNode, connectedNodes))
      .style("opacity", (d) => getNodeOpacity(d.id, selectedNode, connectedNodes))
      .style("stroke-width", 0.5)
      .style("stroke", "black");

      selectAll('circle')
        .on('click', function (e, d) {
          if (clicked === true && selectedNode === d.id) {
            setSelectedNode("");
            setClicked(false);
          } else {
            setSelectedNode(d.id);
            setClicked(true);
          }

        })
        .on('mouseover', function (e, d) {
          if(!clicked){
            setSelectedNode(d.id);
          }
        })
        .on('mouseout', function (e, d) {
          if(!clicked){
            setSelectedNode("");
          }
        })

      // Adding the text to the circles
      nodeGroup
        .selectAll("text")
        .data((d) => [d])
        .join("text")
        .text((d) => d.id)
        .attr("dy", 1);

      }, [selectedNode]);

  return (
    <div className="Explore">
      <div className="calendar-button">
        <Link to="/calendar">
          <img src={shopping_cart_logo} alt="Go to Calendar" />
        </Link>
      </div>
  
      <div className="content-container">
        <div className="sidebar">
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
  
        <div className="simulation-container">
          <svg id="simulation-svg"></svg>
        </div>
      </div>
    </div>
  );
}

export default GraphPage;
