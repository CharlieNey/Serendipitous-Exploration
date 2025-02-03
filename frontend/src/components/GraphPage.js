import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

const GraphPage = () => {
  // Mock dummy graph. Code adapted from d3indepth.com. 
  const graphWidth = 750;
  const graphHeight = 750;

  // Import state variables and fetching methods
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, setSelectedNode, fetchNodes, fetchLinks, fetchNodesConnections } = useContext(GraphContext);
  const [nodeSelections, setNodeSelections] = useState(["", ""])
  
  function getLinkOpacity(link) {
    if(nodeSelections[1] === "" || link.source.id === nodeSelections[1] || link.target.id === nodeSelections[1] ) { // if nothing selected, everything is colored
      return 1;
    }
    return 0.05;
  }
  
  function getNodeOpacity(node) {
    if (nodeSelections[1] === "" || node === nodeSelections[1] || connectedNodes[nodeSelections[1]].includes(node)) {
      return 1;
    }
    return 0.5;
  }
  
  function getNodeColor(node) {
    if (nodeSelections[1] === "" || connectedNodes[nodeSelections[1]] === undefined) {
      return "pink";
    }
  
    if (node === nodeSelections[1]) {
      return "red";
    } else if (connectedNodes[nodeSelections[1]].includes(node)){
      return "green";
    }
    return "pink";
  }

  async function refreshGraph() {
    d3.select(".links")
      .selectAll("line")
      .style("opacity", (d) => getLinkOpacity(d))
      .style("stroke", (d) => color((d.score - 0.5) * 2)) // Change to min similarity score
  
    d3.select(".nodes")
      .selectAll("g")
      .selectAll("circle")
      .style("fill", (d) => getNodeColor(d.id))
      .style("opacity", (d) => getNodeOpacity(d.id));
  }

  // Fetch values for state variables
  useEffect(() => {
    fetchNodes();
    fetchLinks();
    fetchNodesConnections();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const color = d3.scaleSequential(d3.interpolatePuBuGn);

  const zoomRef = useRef(null);
  
  // Create graph
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0 || connectedNodes.length === 0) return;

    const svg = d3
      .select("#simulation-svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)

    if (!zoomRef.current) {
      zoomRef.current = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
          svg.select("g").attr("transform", event.transform);
        });
  
      svg.call(zoomRef.current);
      }
    
    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-10)) // spreads nodes apart
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2)) // location on page
      .force("link", d3.forceLink(links).id(d => d.id).distance(10)) // links nodes together

    const linksGroup = d3.select(".links")
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke-width", 2)

    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")

    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 5)
      .style("stroke-width", 0.5)
      .style("stroke", "black")

    // Adding the text to the circles
    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 1)
    
    refreshGraph()

    nodeGroup
      .selectAll('circle')
      .on('click', (e, d) => setSelectedNode([-1, d.id]))
      .on('mouseenter', function (e, d) {
        setSelectedNode(d.id)
      })
      .on('mouseout', function (e, d) {
        setSelectedNode("")
      });

    simulation
      .on("tick", () => {
        linksGroup
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)

        nodeGroup
          .attr("transform", (d) => `translate(${d.x},${d.y})`)
      });

      return () => {
        simulation.stop();
        svg.selectAll(".links").remove();
        svg.selectAll(".nodes").remove();
      };
    }, [links, nodes, connectedNodes]);

    useEffect(() => {
      if (selectedNode[0] === -1) {
        if (nodeSelections[0] === selectedNode[1]) {
          setNodeSelections(["", ""])
        } else {
          setNodeSelections([selectedNode[1], selectedNode[1]])
        }
      } else if(nodeSelections[0] === "") {
        setNodeSelections(["", selectedNode])
      }
    }, [selectedNode]);

    useEffect(() => {
      refreshGraph()
    }, [nodeSelections]);

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
                  onClick={() => setSelectedNode([-1, course.course_number])}  // update selected node when clicked
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
  
        <div className="simulation-container" >
          <svg id="simulation-svg">
              <g id="zoom-group">
                <g class="links"></g>
                <g class="nodes"></g>
              </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default GraphPage;
