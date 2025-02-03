import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

function getAllNodeConnections(links) {
  var connections = {}
  for (var i in links) {
    var node1 = links[i].source
    var node2 = links[i].target

    if(node1 in connections) {
      if(!connections[node1].includes(node2)){
        connections[node1].push(node2)
      }
    } else {
      connections[node1] = [node2]
    }

    if(node2 in connections) {
      if(!connections[node2].includes(node1)){
        connections[node2].push(node1)
      }
    } else {
      connections[node2] = [node1]
    }
  }
  return connections;
}

function getLinkOpacity(link, selectedNode) {
  if(selectedNode === "" || link.source.id === selectedNode || link.target.id === selectedNode ) {
    return 1;
  }
  return 0.05;
}

function getNodeOpacity(node, selectedNode, connectedNodes) {
  if (selectedNode === "" || node === selectedNode || connectedNodes[selectedNode].includes(node)) {
    return 1;
  }
  return 0.5;
}

function getNodeColor(node, selectedNode, connectedNodes) {
  if (selectedNode === "" || connectedNodes[selectedNode] === undefined) {
    return "pink";
  }
  if (node === selectedNode) {
    return "red";
  } else if (connectedNodes[selectedNode].includes(node)){
    return "green";
  }
  return "pink";
}

const GraphPage = () => {
  const graphWidth = 750;
  const graphHeight = 750;
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, setSelectedNode, fetchNodes, fetchLinks } = useContext(GraphContext);
  const [clicked, setClicked] = useState(false);
  const [connectedNodes, setConnectedNodes] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pinnedNode, setPinnedNode] = useState(null);
  const [currentTransform, setCurrentTransform] = useState(d3.zoomIdentity);

  function clickNode(node) {
    const svg = d3.select("#simulation-svg");

    if (clicked === true && selectedNode === node) {
      setClicked(false);
      setSelectedNode("");
      if (pinnedNode && pinnedNode.id === node) {
        setPinnedNode(null);
        setHoveredNode(null);
      }
    } else {
      setClicked(true);
      setSelectedNode(node);

      const transform = d3.zoomIdentity
        .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
        .scale(2); 

      setPinnedNode(nodes.find(n => n.id === node));
      setHoveredNode(nodes.find(n => n.id === node));
    }
  }

  function refreshGraph() {
    d3.select(".links")
      .selectAll("line")
      .style("opacity", (d) => getLinkOpacity(d, selectedNode))
      .style("stroke", (d) => color((d.score - 0.5) * 2));

    d3.select(".nodes")
      .selectAll("g")
      .selectAll("circle")
      .style("fill", (d) => getNodeColor(d.id, selectedNode, connectedNodes))
      .style("opacity", (d) => getNodeOpacity(d.id, selectedNode, connectedNodes));
  }

  useEffect(() => {
    fetchNodes();
    fetchLinks();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const color = d3.scaleSequential(d3.interpolatePuBuGn);

  const zoomRef = useRef(null);

  useEffect(() => {
    if (nodes.length === 0 || links.length === 0) return;

    setConnectedNodes(getAllNodeConnections(links));

    const svg = d3
      .select("#simulation-svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight);

    svg
      .append("rect")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .style("fill", "transparent")
      .on("click", () => {
        setSelectedNode("");
        setPinnedNode(null);
        setHoveredNode(null);
        setClicked(false);
      });
    
    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .force("link", d3.forceLink(links).id(d => d.id).distance(10));

    const linksGroup = d3.select(".links")
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke-width", 2);

    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");

    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 10)
      .style("stroke-width", 0.5)
      .style("stroke", "black")
      .attr("id", d => d);

    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 1);

    nodeGroup
      .selectAll("circle")
      .on("mouseover", (e, d) => {
        if (!pinnedNode) {
          setHoveredNode(d);
        }
      })
      .on("mouseout", (e, d) => {
        if (!pinnedNode) {
          setHoveredNode(null);
        }
      })
      .on("click", (e, d) => {
        e.stopPropagation(); 
        setSelectedNode(d.id);
        clickNode(d.id);
      });

    simulation.on("tick", () => {
      linksGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    refreshGraph();

    return () => {
      simulation.stop();
      svg.selectAll(".links").remove();
      svg.selectAll(".nodes").remove();
    };
  }, [links, nodes]);

  useEffect(() => {
    refreshGraph();
  }, [selectedNode]);

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
                    onClick={() => {
                      if (selectedNode === course.course_number) {
                        setSelectedNode("");
                      } else {
                        setSelectedNode(course.course_number);
                      }
                    }}
                  >
                    <button
                      className="add-to-calendar-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedCourses((prevCourses) => {
                          const updatedCourses = [...prevCourses, course];
                          return updatedCourses;
                        });
                      }}
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
          <svg id="simulation-svg">
            <g id="zoom-group">
              <g className="links"></g>
              <g className="nodes"></g>
            </g>
          </svg>
        </div>
      </div>
  
      { (hoveredNode || pinnedNode) && (() => {
          const nodeToDisplay = pinnedNode || hoveredNode;
          const matchingCourse = courseList.find(c => c.course_number === nodeToDisplay.id);

          return (
            <div
              className="node-popup"
              style={{
                left: currentTransform.applyX(nodeToDisplay.x),
                top: currentTransform.applyY(nodeToDisplay.y)+50,
              }}
            >
              <button
                className="close-button"
                onClick={() => {
                  setPinnedNode(null);
                  setHoveredNode(null);
                }}
              >
                X
              </button>

              {matchingCourse ? (
                <>
                  <h3>{matchingCourse.course_number}</h3>
                  <p><strong>Title:</strong> {matchingCourse.course_title}</p>
                  <p><strong>Credits:</strong> {matchingCourse.credits}</p>
                  <p><strong>Description:</strong> {matchingCourse.description}</p>
                  <p><strong>Liberal Arts Requirements:</strong> {matchingCourse.liberal_arts_requirements}</p>
                  <p><strong>Prerequisites:</strong> {matchingCourse.prerequisites || "None"}</p>
                  <p><strong>Faculty:</strong> {matchingCourse.faculty}</p>
                  <p><strong>Meeting Day:</strong> {matchingCourse.meeting_day}</p>
                  <p><strong>Location:</strong> {matchingCourse.location}</p>
                  <p><strong>Time:</strong> {matchingCourse.time}</p>
                </>
              ) : (
                <p>No details found for {nodeToDisplay.id}.</p>
              )}
            </div>
          );
        })()
      }
    </div>
  );  
}

export default GraphPage;
