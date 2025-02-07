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
  const { courseList, searchTerm, isLoading, setSearchTerm, fetchCourses } = useContext(SearchContext);
  const { nodes, links, connectedNodes, fetchNodes, fetchLinks, fetchNodesConnections } = useContext(GraphContext);

  // separate pinned vs hovered
  const [pinnedNodeId, setPinnedNodeId] = useState("");
  const [hoveredNodeId, setHoveredNodeId] = useState("");
  const [pinnedTooltipClosed, setPinnedTooltipClosed] = useState(false);

  // for storing each node’s x,y so we can position tooltips
  const [nodePositions, setNodePositions] = useState({});

  const zoomRef = useRef(null);

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

  // decide which node is “active” in terms of highlight
  // if pinnedNodeId is not empty, we use that. otherwise, we use hoveredNodeId
  const activeNodeId = pinnedNodeId !== "" ? pinnedNodeId : hoveredNodeId;

  function getLinkOpacity(link) {
    if (!activeNodeId || activeNodeId === "") {
      return 1;
    }
    if (link.source.id === activeNodeId || link.target.id === activeNodeId) {
      return 1;
    }
    return 0.05;
  }

  function getNodeColor(node) {
    if (!activeNodeId || !connectedNodes[activeNodeId]) return "pink";
    if (node === activeNodeId) return "red";
    if (connectedNodes[activeNodeId].includes(node)) return "green";
    return "pink";
  }
  
  function getNodeOpacity(node) {
    if (!activeNodeId) return 1;
    if (node === activeNodeId || connectedNodes[activeNodeId]?.includes(node)) return 1;
    return 0.2;
  }

  function refreshGraph() {
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

  // build the graph once we have data
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0 || connectedNodes.length === 0) 
    return;

    const svg = d3
      .select("#simulation-svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight);

    // setup zoom if not set yet
    if (!zoomRef.current) {
      zoomRef.current = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
          d3.select("#zoom-group").attr("transform", event.transform);
        });
    }
    svg.call(zoomRef.current); // Single call

    // clicking *outside* a node => unpin if pinnedNodeId is set, or do nothing if no pinned node
    svg.on("click", function (event) {
      const isNode = event.target.tagName === "circle" || event.target.tagName === "text";
      if (!isNode) {
        // If we want to unpin on background click:
        if (pinnedNodeId !== "") {
          setPinnedNodeId("");
          setPinnedTooltipClosed(false);
          // zoom out
          svg.transition()
            .duration(750)
            .call(zoomRef.current.transform, d3.zoomIdentity);
        }
      }
    });

    // clear existing
    svg.selectAll("#zoom-group").remove();
    svg.append("g").attr("id", "zoom-group");
    svg.select("#zoom-group").append("g").attr("class", "links");
    svg.select("#zoom-group").append("g").attr("class", "nodes");

    // setup simulation
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
      .on("mouseenter", function (e, d) {
        setHoveredNodeId(d.id); 
      })
      .on("mouseout", function (e, d) {
        setHoveredNodeId("");
      })
      .on("click", function (e, d) {
        e.stopPropagation();
        
        // if we click the same pinned node => unpin + zoom out
        if (pinnedNodeId === d.id) {
          setPinnedNodeId("");
          setPinnedTooltipClosed(false);
          svg.transition()
            .duration(750)
            .call(zoomRef.current.transform, d3.zoomIdentity);
        } 
        else {
          // pin a new node => zoom in
          setPinnedNodeId(d.id);
          setPinnedTooltipClosed(false);

          const transform = d3.zoomIdentity
            .translate(graphWidth / 2 - d.x * 2, graphHeight / 2 - d.y * 2)
            .scale(2);

          if (zoomRef.current) {
            svg.transition()
              .duration(750)
              .call(zoomRef.current.transform, transform);
          }
        }
      });

    // Labels
    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 2);

    // kick off simulation
    simulation.on("tick", () => {
      linksGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup
        .attr("transform", (d) => {
          // store positions for tooltips
          setNodePositions(prev => ({
            ...prev,
            [d.id]: { x: d.x, y: d.y }
          }));
          return `translate(${d.x},${d.y})`;
        });
    });

    // cleanup on unmount
    return () => {
      simulation.stop();
    };
  }, [nodes, links, connectedNodes, pinnedNodeId]);

  // Re-style nodes/links whenever pinned/hover changes
  useEffect(() => {
    refreshGraph();
  }, [pinnedNodeId, hoveredNodeId]);

  // the code below is just tooltip logic
  
  // pinned tooltip data & position
  const pinnedCourseData = pinnedNodeId
    ? courseList.find((c) => c.course_number === pinnedNodeId)
    : null;
  const pinnedPos = pinnedNodeId && nodePositions[pinnedNodeId]
    ? nodePositions[pinnedNodeId]
    : null;

  // hovered tooltip data & position
  const hoveredCourseData = hoveredNodeId
    ? courseList.find((c) => c.course_number === hoveredNodeId)
    : null;
  const hoveredPos = hoveredNodeId && nodePositions[hoveredNodeId]
    ? nodePositions[hoveredNodeId]
    : null;

  // offset so the tooltip doesn't cover the node exactly
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
                    onClick={() => {
                      const svg = d3.select("#simulation-svg");
                      const node = nodes.find(n => n.id === course.course_number);

                      if (pinnedNodeId === course.course_number) {
                        // unpin & zoom out
                        setPinnedNodeId("");
                        setPinnedTooltipClosed(false);
                        svg.transition()
                          .duration(750)
                          .call(zoomRef.current.transform, d3.zoomIdentity);
                      } else {
                        // pin & zoom in (if we actually have x,y for that node in the graph)
                        setPinnedNodeId(course.course_number);
                        setPinnedTooltipClosed(false);

                        if (node) {
                          const transform = d3.zoomIdentity
                            .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
                            .scale(2);

                          svg.transition()
                            .duration(750)
                            .call(zoomRef.current.transform, transform);
                        }
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <button
                      onClick={(e) => {
                        // Stop the parent li onClick from also pinning
                        e.stopPropagation();
                        setSavedCourses((prevCourses) => {
                          return [...prevCourses, course];
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

          {/* pinned tooltip */}
          {pinnedNodeId &&
           pinnedCourseData &&
           pinnedPos &&
           !pinnedTooltipClosed && (
            <div
              className="tooltip pinned-tooltip"
              style={{
                top: pinnedPos.y + tooltipOffset.y,
                left: pinnedPos.x + tooltipOffset.x
              }}
            >
              <button
                className="tooltip-close"
                onClick={() => {
                  // Hide pinned tooltip but keep it pinned
                  setPinnedTooltipClosed(true);
                }}
              >
                X
              </button>
              <div className="tooltip-content">
                <h4>{pinnedCourseData.course_number}: {pinnedCourseData.course_title}</h4>
                <p><strong>Credits:</strong> {pinnedCourseData.credits}</p>
                <p><strong>Description:</strong> {pinnedCourseData.description}</p>
                <p><strong>Offered Term:</strong> {pinnedCourseData.offered_term}</p>
                <p><strong>Liberal Arts Requirements:</strong> {pinnedCourseData.liberal_arts_requirements}</p>
                <p><strong>Tags:</strong> {pinnedCourseData.tags}</p>
                <p><strong>Prerequisites:</strong> {pinnedCourseData.prerequisites}</p>
                <p><strong>Faculty:</strong> {pinnedCourseData.faculty}</p>
                <p><strong>Meeting Day:</strong> {pinnedCourseData.meeting_day}</p>
                <p><strong>Location:</strong> {pinnedCourseData.location}</p>
                <p><strong>Time:</strong> {pinnedCourseData.time}</p>
              </div>
            </div>
          )}

          {/* hovered tooltip */}
          {hoveredNodeId &&
           hoveredCourseData &&
           hoveredPos &&
           // If pinned is the same node, skip hover tooltip
           (pinnedNodeId !== hoveredNodeId || pinnedTooltipClosed) && (
            <div
              className="tooltip hovered-tooltip"
              style={{
                top: hoveredPos.y + tooltipOffset.y,
                left: hoveredPos.x + tooltipOffset.x
              }}
            >
              <div className="tooltip-content">
                <h4>{hoveredCourseData.course_number}: {hoveredCourseData.course_title}</h4>
                <p><strong>Credits:</strong> {hoveredCourseData.credits}</p>
                <p><strong>Description:</strong> {hoveredCourseData.description}</p>
                <p><strong>Offered Term:</strong> {hoveredCourseData.offered_term}</p>
                <p><strong>Liberal Arts Requirements:</strong> {hoveredCourseData.liberal_arts_requirements}</p>
                <p><strong>Tags:</strong> {hoveredCourseData.tags}</p>
                <p><strong>Prerequisites:</strong> {hoveredCourseData.prerequisites}</p>
                <p><strong>Faculty:</strong> {hoveredCourseData.faculty}</p>
                <p><strong>Meeting Day:</strong> {hoveredCourseData.meeting_day}</p>
                <p><strong>Location:</strong> {hoveredCourseData.location}</p>
                <p><strong>Time:</strong> {hoveredCourseData.time}</p>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
