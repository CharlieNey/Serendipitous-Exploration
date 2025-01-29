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
      if(!connections[node1].includes(node2)){ // if node2 is not in node1 
        connections[node1].push(node2) // push node2 to node1
      }
    } else {
      connections[node1] = [node2] // if node1 is not in connections, make node2 the first in list
    }

    // this doesn't seem too necessary 
    // if(node2 in connections) {
    //   if(!connections[node2].includes(node1)){
    //     connections[node2].push(node1)
    //   }
    // } else {
    //   connections[node2] = [node1]
    // }
  }
  return connections;
}

function getLinkOpacity(link, selectedNode) {
  if(selectedNode === "" || link.source.id === selectedNode || link.target.id === selectedNode ) { // if nothing selected, everything is colored
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
  // Mock dummy graph. Code adapted from d3indepth.com. 
  const graphWidth = 750;
  const graphHeight = 750;

  // Import state variables and fetching methods
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, setSelectedNode, fetchNodes, fetchLinks } = useContext(GraphContext);
  const [clicked, setClicked] = useState(false)

  const[connectedNodes, setConnectedNodes] = useState([]);

  // function clickNode(node) {
  //   if (clicked === true && selectedNode === node) { // to unclick something already selected
  //     setClicked(false);
  //     setSelectedNode("");
  //   } else {
  //     setClicked(true);
  //     setSelectedNode(node);
  //   }
  // }

  function clickNode(node) {
    const svg = d3.select("#simulation-svg");

    if (clicked === true && selectedNode === node) {
      setClicked(false);
      setSelectedNode("");
  
      if (zoomRef.current) {
        svg.transition()
          .duration(750)
          .call(zoomRef.current.transform, d3.zoomIdentity);
      }
    } else {
      setClicked(true);
      setSelectedNode(node);

      const svg = d3.select("#simulation-svg");
  
      const transform = d3.zoomIdentity
        .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
        .scale(2);
  
     
      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);
    }
  }

  function refreshGraph() {
    d3.select(".links")
      .selectAll("line")
      .style("opacity", (d) => getLinkOpacity(d, selectedNode))
      .style("stroke", (d) => color((d.score - 0.5) * 2)) // Change to min similarity score
  
    d3.select(".nodes")
      .selectAll("g")
      .selectAll("circle")
      .style("fill", (d) => getNodeColor(d.id, selectedNode, connectedNodes))
      .style("opacity", (d) => getNodeOpacity(d.id, selectedNode, connectedNodes));
  }

  // Fetch values for state variables
  useEffect(() => {
    fetchNodes();
    fetchLinks();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const color = d3.scaleSequential(d3.interpolatePuBuGn);

  const zoomRef = useRef(null);
  
  // Create graph
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0) return;

    setConnectedNodes(getAllNodeConnections(links))

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

    nodeGroup
      .selectAll('circle')
      .on('click', function (e, d) {
        setSelectedNode(d.id);
        clickNode(d.id);
        
      })

    

    // .on('mouseover', function (e, d) {
    //   if(!clicked){
    //     setSelectedNode(d.id);
    //   }
    // })
    // .on('mouseout', function (e, d) {
    //   if(!clicked){
    //     setSelectedNode("");
    //   }
    // });

    refreshGraph()

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
    }, [links, nodes]);

  useEffect(() => {
    // console.log("Rerun")
    // console.log(clicked)
    // console.log(selectedNode)

    refreshGraph()
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
                  onClick={() => clickNode(course.course_number)}  // update selected node when clicked
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
