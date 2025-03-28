/**
 * @file GraphPage.js
 * @description Creates the graph page, defines the structure and behavior of the interactive graph.
 * @authors Cathy, Kai, Willow, Zoey
 * @date 3/12/25
 */

import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import add_icon from '../images/add.png';
import help_icon from '../images/help.png';
import back_icon from '../images/back.png';
import color_legend from '../images/color_legend.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

/**
* Returns the graph page's layout.
* @param {function} setShowNavbar - sets whether or not the navbar is visible on a page.
* @return {html} the graph page's html.
*/
const GraphPage = ({ setShowNavbar }) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 }); // stores the dimensions of the container
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext); // stores the user's saved courses
  const { allCourses, courseList, searchTerm, isLoading, setSearchTerm, fetchCourses } = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, minval, clickedQueue, setSelectedNode, setClickedQueue } = useContext(GraphContext);
  const [ nodeSelections, setNodeSelections] = useState(["", ""]); // stores a list with the first item containing the currently clicked and second containing the selected node
  const zoomRef = useRef(null); // stores a reference to the zoom behavior for controlling zoom and pan capabilites 
  const [metadata, setMetadata] = useState(null); // stores detailed metadata for the currently selected course node
  const [savedAlertShown, setSavedAlertShown] = useState(false); // stores whether the add to cart button has been clicked at least once
  const [searchAlertShown, setSearchAlertShown] = useState(false); // stores whether the search bar has been clicked at least once
  const [nodeAlertShown, setNodeAlertShown] = useState(false); // stores whether course details have been inspected at least once
  const [hoveredLink, setHoveredLink] = useState(null); // stores the currently hovered link object, used to highlight related words in the course description

  /**
   * Set the navbar to show on this page.
   * @return {void}
   */
  useEffect(() => {
    setShowNavbar(true);
  }, []);

  /**
   * Updates the courseList to match the current search term.
   * @param {String} searchTerm - the current search input
   * @return {void}
   */
  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  /**
   * Observes and updates the dimensions of the container element.
   * @return {void}
   */
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      updateDimensions();
    }

    return () => observer.disconnect();
  }, []);

  /**
  * Returns whether or not a the text on a link should be visible.
  * @param {Object} link - the link whose text we are finding the opacity of.
  * @return {int} 1 if the link's source is the currently selected node, 0 otherwise.
  */
  function getTextOpacity(link) {
    if (link.source.id === nodeSelections[0]) {
      return 1;
    }
    return 0;
  }

  /**
  * Returns the current opacity a link should take based on the selected node.
  * @param {Object} link - the link we are finding the opacity of.
  * @return {int} 1 if the link's source is the currently selected node, 0.05 otherwise.
  */
  function getLinkOpacity(link) {
    if (nodeSelections[1] === "" || link.source.id === nodeSelections[1] || link.target.id === nodeSelections[1]) {
      return 1;
    }
    return 0.05;
  }

  /**
  * Returns the current color a node should take based on whether it is selected, related to the selected node, or none of the above.
  * @param {Object} node - the node we are finding the color of.
  * @return {String} the HEX value the input node should take on. 
  */
  function getNodeColor(node) {
    if (nodeSelections[1] === "" || !connectedNodes[nodeSelections[1]]) {
      return "#FFC20A";
    }
  
    if (node === nodeSelections[1]) {
      return "#1B8AEA";
    } else if (connectedNodes[nodeSelections[1]].includes(node)){
      return "#FFF502";
    }
    return "#FFC20A";
  }

  /**
  * Returns the current opacity a node should take based on the selected node.
  * @param {Object} link - the node we are finding the opacity of.
  * @return {int} 1 if the node is selected or related to the selected node, 0 otherwise.
  */
  function getNodeOpacity(node) {
    if (nodeSelections[1] === "" || node === nodeSelections[1] || connectedNodes[nodeSelections[1]].includes(node)) {
      return 1;
    }
    return 0.2;
  }

  /**
  * Redraws elements of a graph which change upon the clicked or selected node changing.
  * @return {void}
  */
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

  /**
  * Sets the current clicked node to the node clicked directly before the current.
  * @return {void}
  */
  async function getPreviousClicked() {
    if (clickedQueue.length !== 0) {
      setClickedQueue(prev => prev.slice(0, prev.length - 1))
      const nextCourse = await clickedQueue[clickedQueue.length - 1]
      setSelectedNode([-3, nextCourse])
    }
  }

  /**
  * Zooms out from, closes the description of, and de-selects the current node after it is clicked a second time, thereby being unselected.
  * @return {void}
  */
  function doubleClickNode() {
    const svg = d3.select("#simulation-svg");

    if(nodeSelections[0] !== "") {
      setClickedQueue(prev => prev.concat([nodeSelections[0]]))
    }

    setNodeSelections(["", ""]);
    setMetadata(null); 

    const initialView = 0.07 // default zoomed out graph view  
    const { width, height } = containerDimensions;

    // Resets the zoom transform and centers the graph 
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2.5).scale(initialView));
  }

  /**
  * Zooms into, opens the description of, and selects a node upon being clicked.
  * @param {Object} node - the newly clicked Node
  * @param {int} isBack - 1 if this node was reached by clicking the back button, 0 if not
  * @return {void}
  */
  function clickNewNode(node, isBack = 0) {
      const svg = d3.select("#simulation-svg");
      const { width, height } = containerDimensions;

      if(isBack !== 1 && nodeSelections[0] !== "") {
        setClickedQueue(prev => prev.concat([nodeSelections[0]]))
      }

      setNodeSelections([node.id, node.id]);
      setMetadata(allCourses.find(c => c.section_listings.split('-')[0] === node.id)); 

      const scale = 1.25; // zoom scale factor 
      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2) 
        .scale(scale)                    
        .translate(-node.x, -node.y);

      // If zoom behavior exists, shift view to new selected node
      if (zoomRef.current) { 
        svg.transition()
          .duration(500)
          .call(zoomRef.current.transform, transform);
      }
      
      if (!nodeAlertShown) {
        setTimeout(() => { // show alert when user inspects a course for the first time
          alert(
            `You are viewing details about a course!\n\n` +
            `What is being shown here?\n` +
            `• Similar courses are connected by a line.\n` +
            `• Word(s) on the line explain why they are similar.\n` +
            `    • Mouse over to see the word(s) highlighted in the description.\n` +
            `    • Click to view the course on the other end of the line.\n\n` +
            `*What does "similar" mean? Read our info page to learn more!`
          );
          setNodeAlertShown(true);
        }, 650); // 650ms delay
      }
    }

  const color = d3.scaleSequential(d3.interpolatePuBuGn); // the color scale for this program

  /**
  * Gives the user an alert detailling how the page works upon their first visit to the page.
  * @return {void}
  */
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('hasVisited');
    if (!isFirstVisit) {
      setTimeout(() => {
        alert(
          `Welcome!\n\n` +
          `To get started, either:\n` +
          `• Look up a course using the search bar; or\n` +
          `• Click on a node`
        );
      }, 650);
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  /**
  * Defines the structure, appearance, interactive behavior, and data pipelines of the graph.
  * @param {List} links - the similar course connections (links) in the graph.
  * @param {List} nodes - the courses (nodes) in the graph.
  * @param {List} connectedNodes - the list mapping nodes to their similar courses.
  * @param {int, int} containerDimensions - the width and height of the graph container
  * @return {void}
  */
  useEffect(() => {
    // do not create graph element if the nodes length, links length, connectedNodes length, container width, or container height are of size zero/
    if (nodes.length === 0 || links.length === 0 || connectedNodes.length === 0) return;
    if (containerDimensions.width === 0 || containerDimensions.height === 0) return;
    
    // Map container dimensions to svg width and height
    const { width, height } = containerDimensions;
    const svg = d3
      .select("#simulation-svg")
      .attr("width", width)
      .attr("height", height);

     // Initialize zoom behavior if it hasn't been 
    if (!zoomRef.current) {
      zoomRef.current = d3.zoom()
        .scaleExtent([0.07, 3])
        .on("zoom", (event) => {
          d3.select("#zoom-group").attr("transform", event.transform);
        });
      
      // Default initial graph zoom  
      const initialView = 0.07; 
      const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2.3) 
        .scale(initialView); 

      svg.call(zoomRef.current); // apply zoom behavior
      svg.call(zoomRef.current.transform, initialTransform); // apply initial transform 
    } else {
      svg.call(zoomRef.current); // if zoom behavior intialized, reapply zoom behavior 
    }

    // Unselect clicked node if user clicks outside of a node object (or link text)
    svg.on("click", function (event) {
      const isNode = event.target.tagName === "circle" || event.target.tagName === "text";
      if (!isNode) {
        doubleClickNode()
      }
    });

    // Create svg element groupings
    svg.append("g").attr("id", "zoom-group");
    svg.select("#zoom-group").append("g").attr("class", "links");
    svg.select("#zoom-group").append("g").attr("class", "nodes");

    // Set physical properties of graph layout
    const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(d => d.score ** -2 * 1000)
    )
    .force("collide", d3.forceCollide()
      .radius(40)    // ~ circle radius + padding
      .strength(2)   // how firmly to push apart
    )

    // Connect links data to graph links
    const linksGroup = d3.select(".links")
      .selectAll("g")
      .data(links)
      .join("g")

    // Connect node data to graph nodes (each node is a <g>, there is one <g> per node and an overall "node" class)
    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");

    // Append node circles to graph, define hovering and clicking behavior for circles
    nodeGroup.append("circle")
      .attr("r", 40)
      .style("fill", (d) => getNodeColor(d.id))
      .style("stroke", "black")
      .style("stroke-width", "10px")
      .on('mouseenter', (e, d) => setSelectedNode(d.id))
      .on('mouseout', (e, d) => setSelectedNode(""))
      .on('click', (e, d) => {
        e.stopPropagation();
        setSelectedNode([-1, d.id]);
      });
    
    // Append node text to graph, link node course titles to text
    nodeGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")
      .style("pointer-events", "none")
      .text(d => d.id);
    
    // Append link lines to graph
    linksGroup
      .selectAll("line")
      .data((d) => [d])
      .join("line")
      .style("stroke", (d) => color((d.score - minval) / (1 - minval)))
      .style("stroke-width", 3);
    
    // Create a secondary set of circle elements for each node
    nodeGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .style("r", 30)
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

    // Create a secondary set of text labels for each node
    nodeGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .text((d) => d.id)
      .attr("dy", 2);
    
    // Append link similarity text to graph, define its behavior when hovered over or clicked
    linksGroup
      .selectAll("text.line-text")
      .data((d) => [d])
      .join("text")
      .classed("line-text", true)
      .text((d) => d.target.id + ": " + formatHighlightWords(d.word))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("dy", -5)
      .attr("cursor", "pointer")
      .on("click", function (e, d) {
        setSelectedNode([-2, d]);
      })
      .on("mouseover", function (e, d) {
        setHoveredLink(d);
      })
      .on("mouseout", function () {
        setHoveredLink(null);
      });
    
    // Load stylistic elements of graph which change upon selected/clicked node
    refreshGraph();
    
    // Adjust graph element positions through simulation of their physical pulling/pushing.
    simulation.on("tick", () => {
      // Update link line positions
      linksGroup
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // Update link text position and angle
      linksGroup
        .selectAll("text.line-text")
        .attr("transform", (d) => {
          const distanceAway = 150; 
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const connectionLength = Math.sqrt(dx ** 2 + dy ** 2); // distance between source and target
      
          const nx = dx / connectionLength;  // normalization of distance to keep distance constant from source
          const ny = dy / connectionLength;
      
          const xPos = d.source.x + nx * distanceAway;
          const yPos = d.source.y + ny * distanceAway;
          
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
          // flip text if upside down
          if (angle > 90 || angle < -90) {
            angle += 180;
          }

          return `translate(${xPos}, ${yPos}) rotate(${angle})`;
        });

      // Update node circle position
      nodeGroup
        .attr("transform", (d) => {
          return `translate(${d.x},${d.y})`;
        });
    });

    // Stop the simulation and remove svg grouping elements upon termination
    return () => {
      simulation.stop();
      svg.selectAll(".links").remove(); // SHOULD WE CLEAN THESE UP IN OTHER PLACES?
      svg.selectAll(".nodes").remove();
      svg.selectAll(".zoom-group").remove();
    };

  }, [links, nodes, connectedNodes, containerDimensions]);

  /**
  * Update the currently selected and clicked node based on requests to select new node.
  * @param {String} selectedNode - a request to select a new node (often as a list where the first element details the request case)
  * @return {void}
  */
  useEffect(() => {
    // The user is attempting to click a node
    if (selectedNode[0] === -1) {
      const node = nodes.find(n => n.id === selectedNode[1]);
      if (!node) return; // do nothing if the node the user clicked does not exist

      if (nodeSelections[0] === selectedNode[1]) { // double click behavior if user clicked the already clicked node
        doubleClickNode();
      } else { // click new node behavior if user clicked a new node
        clickNewNode(node);
      }
    // The user is attempting to click a node by clicking a link's similarity text
    } else if (selectedNode[0] === -2) {
      const link = selectedNode[1];

      // The new clicked node is the node opposite to the currently clicked node on the link whose text was clicked.
      if (nodeSelections[0] === link.source.id) {
          const targetNode = nodes.find(n => n.id === link.target.id);
        if (!targetNode) return;
          clickNewNode(targetNode);
      } else {
        const sourceNode = nodes.find(n => n.id === link.source.id);
        if (!sourceNode) return;
        clickNewNode(sourceNode);
      }
    // The user is attempting to click a new node through the back button
    } else if(selectedNode[0] === -3) {
      const node = nodes.find(n => n.id === selectedNode[1]);
      if (!node) return; // do nothing if the node the user clicked does not exist
      clickNewNode(node, 1);
    
    // No node is currently clicked and the user is hovering over a node
    }else if (nodeSelections[0] === "") {
      setNodeSelections(["", selectedNode]);
    }
  }, [selectedNode]);
  

  /**
  * Update the graph whenever a new node is clicked or selected.
  * @param {List} nodeSelections - the currently clicked and selected node.
  * @return {void}
  */
  useEffect(() => {
    refreshGraph();
  }, [nodeSelections]);

  /**
  * Formats the meeting times string into a more readable format.
  * @param {String} dayStartEnd - the string containing the meeting times.
  * @return {Object} - An object with two properties: 'meetingDay' and 'time'.
  */
  function formatMeetingTimes(dayStartEnd) {
    if (!dayStartEnd) return { meetingDay: '', time: '' };
  
    const parts = dayStartEnd.split('\n\n').map(part => part.trim());
    let meetingDay = '';
    let time = '';
  
    const mwTime = parts.find(part => part.startsWith('MW'));
    const tthTime = parts.find(part => part.startsWith('TTH'));
    const fTime = parts.find(part => part.startsWith('F'));
  
    const times = [];
    if (mwTime) times.push(`MW: ${mwTime.split('|')[1].trim()}`);
    if (tthTime) times.push(`TTH: ${tthTime.split('|')[1].trim()}`);
    if (fTime) times.push(`F: ${fTime.split('|')[1].trim()}`);
  
    if (times.length > 0) {
      meetingDay = times.map(t => t.split(':')[0]).join(', ');
      time = times.join(' & ');
    }
  
    return { meetingDay, time };
  }

  /**
  * Formats the liberal arts requirement (LAR) tags into a more readable format
  * @param {String} courseTags - the string containing the course tags
  * @return {String} - A string of formatted LARs (with its full name and abbreviation), or 'None' if no requirements are found.
  */
  function formatLiberalArtsRequirements(courseTags) {
    if (!courseTags) return 'None';
  
    // all possible LARs
    const larMap = {
      'HI': 'Humanistic Inquiry',
      'IDS': 'Intercultural Domestic Studies',
      'WR2': 'Writing Requirement 2',
      'ARP': 'Arts Practice',
      'FSR': 'Formal or Statistical Reasoning',
      'LA': 'Literary/Artistic Analysis',
      'LS': 'Science with Lab',
      'SI': 'Social Inquiry',
      'IS': 'International Studies',
      'QRE': 'Quantitative Reasoning Encounter'
    };
  
    // Extract all LAR tags
    const larTags = courseTags
      .split('\n\n') 
      .flatMap(tag => {
        const larParts = tag.split('LAR:').slice(1); 
        return larParts.map(part => part.trim()); 
      })
      .flatMap(tag => tag.split(',')) 
      .map(tag => tag.trim()) 
      .filter(tag => {
        const abbreviation = tag.split(' ')[0];
        return Object.keys(larMap).includes(abbreviation);
      });
  
    if (larTags.length === 0) return 'None';
  
    const formattedLARs = larTags
      .map(tag => {
        const abbreviation = tag.split(' ')[0]; 
        const fullName = larMap[abbreviation];
        return fullName ? `${fullName} (${abbreviation})` : null; 
      })
      .filter(tag => tag !== null) 
      .join(', ');
  
    return formattedLARs;
  }

  /**
  * Formats string of words by wrapping each individual word in double quotes and joining them with a comma.
  * @param {String} wordString - The raw string containing words separated by whitespace.
  * @return {String} - A formatted string with each word wrapped in quotes and separated by commas.
  */
  function formatHighlightWords(wordString) {
    if (!wordString) return "";
    let trimmed = wordString.trim();
    const words = trimmed.split(/\s+/);
    return words.map(w => `"${w}"`).join(", ");
  }

  /**
  * Parses raw word string by removing any double quotes and splitting it into an array of words.
  * @param {String} rawWordString - The raw string containing words separated by whitespace.
  * @return {Array} - An array of words, with any empty strings filtered out.
  */
  function parseLinkWords(rawWordString) {
    if (!rawWordString) return [];
    const cleaned = rawWordString.replace(/"/g, "");
    return cleaned.split(/\s+/).filter(Boolean);
  }  

  /**
  * Generates a version of the course description with certain words highlighted.
  * Highlights are applied if a hovered link exists and if the course corresponding to the metadata matches the hovered link's nodes.
  * The words to highlight are determined by parsing the hovered link's word string.
  * @return {String} - The course description with HTML markup for highlighted words, or the original description if no words are to be highlighted.
  */
  function getHighlightedDescription() {
    if (!metadata) return "";
    if (!hoveredLink) return metadata.description;
    
    const currentCourseId = metadata.section_listings.split('-')[0];
    const sourceId = hoveredLink.source.id;
    const targetId = hoveredLink.target.id;
  
    if (currentCourseId !== sourceId && currentCourseId !== targetId) {
      return metadata.description;
    }
    
    const wordsArray = parseLinkWords(hoveredLink.word);
    if (wordsArray.length === 0) return metadata.description;

    let highlighted = metadata.description;
    wordsArray.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b(${escaped})\\b`, "gi");
      highlighted = highlighted.replace(
        regex,
        `<span class="highlight">$1</span>`
      );
    });
  
    return highlighted;
  }
  

  return (
    <div className="GraphPage">

      <div className="content-container">

        <div className="scroll-sidebar">
          <div className="search-section">
            <label for="siteSearch" class="sr-only">Search</label>
            <input
              type="text"
              placeholder="Course name, description, or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { // show alert to user when first time clicks on the search bar
                if (!searchAlertShown) {
                  alert(
                    `What can you search for?\n` +
                    `This website currently only shows Spring 2025 courses that are:\n` +
                    `• 6-credits\n` +
                    `• Lab courses\n` +
                    `*Only one section is displayed for courses with multiple sections (e.g., 100.01, 100.02)\n\n` +
                    `What’s not included:\n` +
                    `• PE\n` +
                    `• Private music lessons\n` +
                    `• Comps\n` +
                    `• Any other non 6-credit courses (except labs)`
                  );
                  setSearchAlertShown(true);
                }
              }}
              className="search-input"
              id="siteSearch"
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
                        if (!savedAlertShown) { // show alert when user first time saves a course 
                          alert("You just saved a course!\nSee all your saved courses in your shopping cart.");
                          setSavedAlertShown(true);
                        }
                      }}
                      className="add-to-calendar-button">
                      <img 
                      src={add_icon}
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

        <div className="simulation-container" ref={containerRef}>
          <svg id="simulation-svg">
            <g id="zoom-group">
              <g className="links"></g>
              <g className="nodes"></g>
            </g>
          </svg>

          <img 
            src={color_legend}
            alt="Color Legend" 
            className="color-legend"
          />

          <img 
            src={help_icon}
            alt="Get Help" 
            className="buttons-on-graph help-button"
            onClick={() => alert( // show alert when user clicks on help button
              `What is being shown here?\n` +
              `• Similar courses are connected by a line.\n` +
              `• Word(s) on the line explain why they are similar.\n` +
              `    • Mouse over to see the word(s) highlighted in the description.\n` +
              `    • Click to view the course on the other end of the line.\n` +
              `*What does "similar" mean? Read our info page to learn more! \n\n` +
              `What courses are included?\n` +
              `Our website currently only shows Spring 2025 courses that are:\n` +
              `• 6-credits\n` +
              `• Lab courses\n` +
              `*Only one section is displayed for courses with multiple sections (e.g., 100.01, 100.02)\n\n` +
              `What’s not included:\n` +
              `• PE\n` +
              `• Private music lessons\n` +
              `• Comps\n` +
              `• Any other non 6-credit courses (except labs)`
            )}
          />

          <img 
            src={back_icon} 
            alt="Go back" 
            className="buttons-on-graph back-button"
            onClick={() => {getPreviousClicked()}} />

          <button 
            className="buttons-on-graph randomizer" 
            onClick={() => {
              const randomCourse = Math.floor(Math.random() * nodes.length);
              setSelectedNode([-1, nodes[randomCourse].id]);
            }}
          >
            Random Course Finder
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
                    if (!savedAlertShown) { // show alert when user first time saves a course
                      alert("You just saved a course!\nSee all your saved courses in your shopping cart.");
                      setSavedAlertShown(true);
                    }
                  }}
                  className="add-to-calendar-button"
                >
                  <img 
                  src={add_icon}
                  alt="Add to Calendar"
                  // if course is already saved, make the cart logo grey
                  className={savedCourses.some(saved => saved.section_listings === metadata.section_listings) ? "grey-cart-button" : ""}
                  />
                </button>
                <p>{metadata.section_listings.split('-')[0]}: {metadata.section_listings.split(' - ')[1]}</p>
              </h4> 
              <p><strong>Description:</strong></p>
              <p><div
                dangerouslySetInnerHTML={{
                  __html: getHighlightedDescription(),
                }}
              /></p>
              <p><strong>Liberal Arts Requirements:</strong> {formatLiberalArtsRequirements(metadata.course_tags)}</p>
              {formatMeetingTimes(metadata.day_start_end).meetingDay && (
                <>
                  <p><strong>Meeting Day:</strong> {formatMeetingTimes(metadata.day_start_end).meetingDay}</p>
                  <p><strong>Time:</strong> {formatMeetingTimes(metadata.day_start_end).time}</p>
                </>
              )}
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