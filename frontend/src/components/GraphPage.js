import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import shopping_cart_logo from '../images/shopping_cart_logo.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

const GraphPage = () => {
  // Code adapted from d3indepth.com. 
  const graphWidth = 750; // when I make both of these 1100, removes the gray column bug
  const graphHeight = 750;

  // Import state variables and fetching methods
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, setSelectedNode, fetchNodes, fetchLinks, fetchNodesConnections } = useContext(GraphContext);
  const [clicked, setClicked] = useState(false)

  const zoomRef = useRef(null);

  function clickNode(nodeId) {
    console.log("node clicked");
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const svg = d3.select("#simulation-svg");

    if (clicked === true && selectedNode === nodeId) {
      console.log("zooming back out!!!");
      setClicked(false);
      setSelectedNode(""); 
      
      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity);

    } else {
      console.log("zooming in!!!");
      setClicked(true);
      setSelectedNode(nodeId);

      const transform = d3.zoomIdentity
        .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
        .scale(2);
     
      if (zoomRef.current){
        svg.transition()
          .duration(750)
          .call(zoomRef.current.transform, transform);
      }
    }
    return 0.5;
  }
  
  function getLinkOpacity(link) {
    if(selectedNode === "" || link.source.id === selectedNode || link.target.id === selectedNode ) { // if nothing selected, everything is colored
      return 1;
    }
    return 0.05;
  }
  
  function getNodeOpacity(node) {
    if (selectedNode === "" || node === selectedNode || connectedNodes[selectedNode].includes(node)) {
      return 1;
    }
  }
  
  function getNodeColor(node) {
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

  async function refreshGraph() {
    // await setSelectedNode(selectedNode)
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

  function clickNode(node) {
    if (clicked === true && selectedNode === node) { // to unclick something already selected
      setClicked(false);
      setSelectedNode("");
    } else {
      setClicked(true);
      setSelectedNode(node);
    }
  }

  // function clickNode(node) {
  //   const svg = d3.select("#simulation-svg");

  //   if (clicked === true && selectedNode === node) {
  //     setClicked(false);
  //     setSelectedNode("");
  
  //     if (zoomRef.current) {
  //       svg.transition()
  //         .duration(750)
  //         .call(zoomRef.current.transform, d3.zoomIdentity);
  //     }
  //   } else {
  //     setClicked(true);
  //     setSelectedNode(node);

  //     const svg = d3.select("#simulation-svg");
  
  //     const transform = d3.zoomIdentity
  //       .translate(graphWidth / 2 - node.x * 2, graphHeight / 2 - node.y * 2)
  //       .scale(2);
  
     
  //     svg.transition()
  //       .duration(750)
  //       .call(zoomRef.current.transform, transform);
  //   }
  // }

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
  
  // Create graph
  useEffect(() => {
    if (nodes.length === 0 || links.length === 0 || connectedNodes.length === 0) return;

    setConnectedNodes(getAllNodeConnections(links))
    console.log("Initializing zoom...");
    
    const svg = d3
      .select("#simulation-svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)

    if (!zoomRef.current) {
      console.log("Creating new zoomRef");
      zoomRef.current = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
          d3.select("#zoom-group").attr("transform", event.transform); 
        });

      svg.call(zoomRef.current);
    } else {
      console.log("Reapplying existing zoomRef");
      svg.call(zoomRef.current);
      }

    svg.on("click", function (event) { // return to full graph look when non-node clicked
      const isNode = event.target.tagName === "circle" || event.target.tagName === "text";
      if (!isNode) {
        setClicked(false);
        setSelectedNode("");
  
        svg.transition()
          .duration(750)
          .call(zoomRef.current.transform, d3.zoomIdentity);
      }
    });
    
    svg.append("g").attr("id", "zoom-group");
    svg.select("#zoom-group").append("g").attr("class", "links");
    svg.select("#zoom-group").append("g").attr("class", "nodes");

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-14)) // spreads nodes apart
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2)) // location on page
      .force("link", d3.forceLink(links).id(d => d.id).distance(10)) // links nodes together

    const linksGroup = d3.select(".links") // binds the links data to each link 
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
      .style("r", 10)
      .style("stroke-width", 0.5)
      .style("stroke", "black")

    // Adding the text to the circles
    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 2)

    nodeGroup
      .selectAll('circle')
      .on('click', function (e, d) {
        e.stopPropagation();
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
    }, [links, nodes, connectedNodes]);

    useEffect(() => {
      refreshGraph()
    }, [clicked, selectedNode]);

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
