import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

const GraphPage = ({ setShowNavbar }) => {
  const graphWidth = 1100;
  const graphHeight = 1100;
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);
  const { allCourses, courseList, searchTerm, isLoading, setSearchTerm, fetchCourses } = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, setSelectedNode, fetchNodes, fetchLinks, fetchNodesConnections } = useContext(GraphContext);
  const [nodeSelections, setNodeSelections] = useState(["", ""]);
  const zoomRef = useRef(null);
  const [pinnedTooltipClosed, setPinnedTooltipClosed] = useState(false);
  const [nodePositions, setNodePositions] = useState({}); 
  const pinnedNodeId = nodeSelections[0];    // pinned node or ""
  const activeNodeId = nodeSelections[1];    // hovered OR pinned, used for color highlight


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
      .style("stroke", (d) => color((d.score - 0.5) * 2));

    d3.select(".nodes")
      .selectAll("g")
      .selectAll("circle")
      .style("fill", (d) => getNodeColor(d.id))
      .style("opacity", (d) => getNodeOpacity(d.id));
  }

  function doubleClickNode() {
    const svg = d3.select("#simulation-svg");

    // user clicked the same pinned node => unselect & zoom out
    setNodeSelections(["", ""]);
    setPinnedTooltipClosed(false);

    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  }

  function clickNewNode(node) {
    const svg = d3.select("#simulation-svg");

    // new pinned node => zoom in
    setPinnedTooltipClosed(false);
    setNodeSelections([selectedNode[1], selectedNode[1]]);
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
    fetchNodes();
    fetchLinks();
    fetchNodesConnections();
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
        .scaleExtent([0.5, 3])
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
      .force("charge", d3.forceManyBody().strength(-14))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .force("link", d3.forceLink(links).id(d => d.id).distance(10));

    // Links
    const linksGroup = d3.select(".links")
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke-width", 2);

    // Nodes: each node is a <g>
    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");
    
    // Circles
    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 10)
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

    refreshGraph();

    simulation.on("tick", () => {
      linksGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup
        .attr("transform", (d) => {
          // store positions for tooltip
          setNodePositions(prev => ({
            ...prev,
            [d.id]: { x: d.x, y: d.y }
          }));
          return `translate(${d.x},${d.y})`;
        });
    });

    return () => {
      simulation.stop();
      svg.selectAll(".links").remove();
      svg.selectAll(".nodes").remove();
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
    } else if (nodeSelections[0] === "") {
      setNodeSelections(["", selectedNode]); // For hover-based selection 
    }
  }, [selectedNode]);

  // Redraw if pinned/hover changes
  useEffect(() => {
    refreshGraph();
  }, [nodeSelections]);

  // Decide which node's tooltip (if any) to show
  const tooltipNodeId = pinnedNodeId && !pinnedTooltipClosed
    ? pinnedNodeId
    : (activeNodeId !== "" ? activeNodeId : null);

  // Retrieve the course data for that tooltipNodeId
  const tooltipCourseData = tooltipNodeId
    ? allCourses.find(c => c.course_number === tooltipNodeId)
    : null;

  // If we know the node's (x,y) from `setNodePositions`, grab that
  const tooltipPos = tooltipNodeId && nodePositions[tooltipNodeId]
    ? nodePositions[tooltipNodeId]
    : null;

  // offset the tooltip a bit so it doesn't cover the node
  const tooltipOffset = { x: 15, y: -20 };

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
                    onClick={() => setSelectedNode([-1, course.course_number])}
                    style={{ cursor: 'pointer' }}
                  >
                    <button
                      onClick={(e) => {
                        // stopPropagation so it doesn't also select/zoom the node
                        e.stopPropagation();
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
          <svg id="simulation-svg">
            <g id="zoom-group">
              <g className="links"></g>
              <g className="nodes"></g>
            </g>
          </svg>

          {/* Tooltip overlay */}
          {tooltipNodeId && tooltipCourseData && tooltipPos && (
            <div
              className="tooltip"
              style={{
                top: tooltipPos.y + tooltipOffset.y,
                left: tooltipPos.x + tooltipOffset.x
              }}
            >
              {/* Show the "X" button ONLY if this tooltip is the pinned node */}
              {tooltipNodeId === pinnedNodeId && !pinnedTooltipClosed && (
                <button
                  className="tooltip-close"
                  onClick={() => {
                    // Clicking X hides pinned tooltip
                    setPinnedTooltipClosed(true);
                    setNodeSelections(["", ""]);
                  }}
                >
                  X
                </button>
              )}

              <div className="tooltip-content">
                <h4>{tooltipCourseData.course_number}: {tooltipCourseData.course_title}</h4>
                <p><strong>Credits:</strong> {tooltipCourseData.credits}</p>
                <p><strong>Description:</strong> {tooltipCourseData.description}</p>
                <p><strong>Liberal Arts Requirements:</strong> {tooltipCourseData.liberal_arts_requirements}</p>
                <p><strong>Prerequisites:</strong> {tooltipCourseData.prerequisites}</p>
                <p><strong>Faculty:</strong> {tooltipCourseData.faculty}</p>
                <p><strong>Meeting Day:</strong> {tooltipCourseData.meeting_day}</p>
                <p><strong>Location:</strong> {tooltipCourseData.location}</p>
                <p><strong>Time:</strong> {tooltipCourseData.time}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
