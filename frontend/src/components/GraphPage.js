import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

const GraphPage = ({ setShowNavbar }) => {
  const graphWidth = 1100; // TODO: Make this more dynamic for different screen sizes
  const graphHeight = 1100;
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);
  const { allCourses, courseList, searchTerm, isLoading, setSearchTerm, fetchCourses } = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, minval, setSelectedNode } = useContext(GraphContext);
  const [nodeSelections, setNodeSelections] = useState(["", ""]);
  const zoomRef = useRef(null);
  // const [nodePositions, setNodePositions] = useState({}); // I THINK WE DON'T NEED THIS
  const [metadata, setMetadata] = useState(null);

  function getTextOpacity(link) {
    if (link.source.id === nodeSelections[0]) {
      return 1;
    }
    return 0;
  }

  function getLinkOpacity(link) {
    if (nodeSelections[1] === "" || link.source.id === nodeSelections[1] || link.target.id === nodeSelections[1]) {
      return 1;
    }
    return 0.05;
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

  function getNodeOpacity(node) {
    if (nodeSelections[1] === "" || node === nodeSelections[1] || connectedNodes[nodeSelections[1]].includes(node)) {
      return 1;
    }
    return 0.2;
  }

  async function refreshGraph() {
    d3.select(".links")
      .selectAll("line")
      .style("opacity", (d) => getLinkOpacity(d))
    
    d3.select(".nodes")
      .selectAll("g")
      .selectAll("circle")
      .style("fill", (d) => getNodeColor(d.id))
      .style("opacity", (d) => getNodeOpacity(d.id));

    d3.select(".links")
      .selectAll("text.line-text")
      .style("opacity", (d) => getTextOpacity(d))
  }

  function doubleClickNode() {
    const svg = d3.select("#simulation-svg");

    setNodeSelections(["", ""]);
    setMetadata(null); // Clear metadata when unselecting a node

    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity); // zooms out
  }

  function clickNewNode(node) {
    const svg = d3.select("#simulation-svg");

    setNodeSelections([node.id, node.id]);
    //////THIS BREAKS SOMETIMES
    setMetadata(allCourses.find(c => c.section_listings.split('-')[0] === node.id)); 

    const transform = d3.zoomIdentity
      .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
      .scale(2);

    if (zoomRef.current) {
      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, transform);
    }
  }

  useEffect(() => {
    setShowNavbar(true);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const color = d3.scaleSequential(d3.interpolatePuBuGn);

  // Build the graph
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0 || connectedNodes.length === 0) return;

    const svg = d3
      .select("#simulation-svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight);

    if (!zoomRef.current) {
      zoomRef.current = d3.zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => {
          d3.select("#zoom-group").attr("transform", event.transform);
        });
      svg.call(zoomRef.current);
    } else {
      svg.call(zoomRef.current);
    }

    // Clicking outside of a node => unselect
    svg.on("click", function (event) {
      const isNode = event.target.tagName === "circle" || event.target.tagName === "text";
      if (!isNode) {
        doubleClickNode()
      }
    });

    svg.append("g").attr("id", "zoom-group");
    svg.select("#zoom-group").append("g").attr("class", "links");
    svg.select("#zoom-group").append("g").attr("class", "nodes");

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .force("link", d3.forceLink(links).id(d => d.id).distance((d) => d.score ** 2 * 100));

    // Links
    const linksGroup = d3.select(".links")
      .selectAll("g")
      .data(links)
      .join("g")

    // Nodes: each node is a <g>
    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");

    linksGroup
      .selectAll("line")
      .data((d) => [d])
      .join("line")
      .style("stroke", (d) => color((d.score - minval) / (1 - minval)))
      .style("stroke-width", 3);
    
    // Circles
    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 12)
      .style("stroke-width", 0.5)
      .style("stroke", "black")
      .on('mouseenter', function(e, d) {
        setSelectedNode(d.id)
      })
      .on('mouseout', function(e, d) {
        setSelectedNode("")
      })
      .on('click', function(e, d) {
        e.stopPropagation();
        setSelectedNode([-1, d.id]);
      });

    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 2);

    linksGroup
      .selectAll("text.line-text")
      .data((d) => [d])
      .join("text")
      .classed("line-text", true)
      .text((d) => "<--" + d.target.id + ": " + d.word + "-->")
      .attr("width", 3)
      .attr("dy", -5) // proximity to line
      .on('click', function(e, d) {
        setSelectedNode([-2, d]);
      });

    refreshGraph();

    simulation.on("tick", () => {
      linksGroup
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linksGroup
        .selectAll("text.line-text")
        .attr("transform", (d) => {
          var angle = Math.atan((d.source.y - d.target.y)/(d.source.x - d.target.x)) * 180 / Math.PI
          // if (isNaN(angle)) { //DO WE NEED THIS?
          //   angle = 0
          // }
          return `translate(${(d.source.x * 5 + d.target.x)/6},${(d.source.y * 5 + d.target.y)/6})rotate(${angle})`
        })

      nodeGroup
        .attr("transform", (d) => {
          // CAN WE MUTE THIS?
          // // store positions for tooltip
          // setNodePositions(prev => ({
          //   ...prev,
          //   [d.id]: { x: d.x, y: d.y }
          // }));
          return `translate(${d.x},${d.y})`;
        });
    });

    return () => {
      simulation.stop();
      svg.selectAll(".links").remove(); // SHOULD WE CLEAN THESE UP IN OTHER PLACES?
      svg.selectAll(".nodes").remove();
      svg.selectAll(".zoom-group").remove();
    };
  }, [links, nodes, connectedNodes]);

  // Once we have a "clicked" event => zoom in or out
  useEffect(() => {
    if (selectedNode[0] === -1) {
      const node = nodes.find(n => n.id === selectedNode[1]);
      if (!node) {
        return;
      }

      if (nodeSelections[0] === selectedNode[1]) {
        doubleClickNode()
      } else {
        clickNewNode(node)
      }
    } else if (selectedNode[0] === -2) {
      if (nodeSelections[0] === selectedNode[1].source.id) {
        const node = nodes.find(n => n.id === selectedNode[1].target.id);
        if (!node) {
          return;
        }
  
        clickNewNode(node)
      }
    } else if (nodeSelections[0] === "") {
      setNodeSelections(["", selectedNode]); // For hover-based selection 
    }
  }, [selectedNode]);

  // Redraw if hovered/clicked nodes
  useEffect(() => {
    refreshGraph();
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
                    key={course.section_listings.split('-')[0]}
                    className="course-item"
                    onClick={() => setSelectedNode([-1, course.section_listings.split('-')[0]])}
                    style={{ cursor: 'pointer' }}
                  >
                    <button
                      onClick={(e) => {
                        // stopPropagation so it doesn't also select/zoom the node
                        e.stopPropagation();
                        // set saved courses
                        setSavedCourses((savedCourse) => {
                          console.log('Clicked course:', course);
                          // check if the course is already in the savedCourses
                          if (savedCourse.some(saved => saved.section_listings === course.section_listings)) {
                            // if course is already saved, remove it
                            const updatedCourses = savedCourse.filter(savedCourse => savedCourse.section_listings !== course.section_listings);
                            console.log('Updated courses after removal:', updatedCourses);
                            return updatedCourses;
                          } else { // if not saved, add it
                            const updatedCourses = [...savedCourse, course];
                            console.log('Updated courses after addition:', updatedCourses);
                            return updatedCourses;
                          }
                        });
                      }}
                      className="add-to-calendar-button"
                    >
                      <img 
                      src={shopping_cart_logo}
                      alt="Add to Calendar"
                      // if course is already saved, make the cart logo grey
                      className={savedCourses.some(saved => saved.section_listings === course.section_listings) ? "grey-cart-button" : ""}
                      />
                    </button>

                    <div className="course-summary">
                      <strong>{course.section_listings.split('-')[0]}:</strong> {course.section_listings.split(' - ')[1]}
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

          <button 
            className="randomizer" 
            onClick={() => {
              const randomCourse = Math.floor(Math.random() * nodes.length);
              setSelectedNode([-1, nodes[randomCourse].id]);
            }}
          >
            Randomizer
          </button>
        </div>
        
        <div className="metadata-section">
          {metadata ? (
            <div className="metadata-content">
              <h4>
                <button
                  onClick={() => {
                    setSavedCourses((savedCourse) => {
                      console.log('Clicked course:', metadata);
                      // check if the course is already in the savedCourses
                      if (savedCourse.some(saved => saved.section_listings === metadata.section_listings)) {
                        // if course is already saved, remove it
                        const updatedCourses = savedCourse.filter(savedCourse => savedCourse.section_listings !== metadata.section_listings);
                        console.log('Updated courses after removal:', updatedCourses);
                        return updatedCourses;
                      } else { // if not saved, add it
                        const updatedCourses = [...savedCourse, metadata];
                        console.log('Updated courses after addition:', updatedCourses);
                        return updatedCourses;
                      }
                    });
                  }}
                  className="add-to-calendar-button"
                >
                  <img 
                  src={shopping_cart_logo}
                  alt="Add to Calendar"
                  // if course is already saved, make the cart logo grey
                  className={savedCourses.some(saved => saved.section_listings === metadata.section_listings) ? "grey-cart-button" : ""}
                  />
                </button>
                {metadata.section_listings.split('-')[0]}: {metadata.section_listings.split(' - ')[1]}
              </h4> 
              <p><strong>Credits:</strong> {metadata.credits}</p>
              <p><strong>Description:</strong> {metadata.description}</p>
              <p><strong>Liberal Arts Requirements:</strong> {metadata.course_tags}</p>
              <p><strong>Meeting Day:</strong> {metadata.day_start_end.split('|')[0]}</p>
              <p><strong>Time:</strong> {metadata.day_start_end.split('|')[1]}</p>
            </div>
          ) : (
            <h4>Select a node to view its info!</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphPage;