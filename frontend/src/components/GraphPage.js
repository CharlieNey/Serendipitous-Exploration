import React, { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import "./GraphPage.css";
import add_icon from '../images/add.png';
import help_icon from '../images/help.png';
import back_icon from '../images/back.png';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';
import { GraphContext } from './GraphContext.js';

const GraphPage = ({ setShowNavbar }) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);
  const { allCourses, courseList, searchTerm, isLoading, setSearchTerm, fetchCourses } = useContext(SearchContext);
  const { selectedNode, nodes, links, connectedNodes, minval, clickedQueue, setSelectedNode, setClickedQueue } = useContext(GraphContext);
  const [ nodeSelections, setNodeSelections] = useState(["", ""]);
  const zoomRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const [savedAlertShown, setSavedAlertShown] = useState(false);
  const [searchAlertShown, setSearchAlertShown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [nodeAlertShown, setNodeAlertShown] = useState(false);


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

  async function getPreviousClicked() {
    if (clickedQueue.length !== 0) {
      setClickedQueue(prev => prev.slice(0, prev.length - 1))
      const nextCourse = await clickedQueue[clickedQueue.length - 1]
      setSelectedNode([-3, nextCourse])
    }
  }

  function doubleClickNode() {
    const svg = d3.select("#simulation-svg");

    if(nodeSelections[0] !== "") {
      setClickedQueue(prev => prev.concat([nodeSelections[0]]))
    }

    setNodeSelections(["", ""]);
    setMetadata(null); 

    const initialView = 0.15
    const { width, height } = containerDimensions;

    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2.5).scale(initialView));
  }

  function clickNewNode(node, isBack = 0) {
    const svg = d3.select("#simulation-svg");
    const { width, height } = containerDimensions;

    if(isBack !== 1 && nodeSelections[0] !== "") {
      setClickedQueue(prev => prev.concat([nodeSelections[0]]))
    }

    setNodeSelections([node.id, node.id]);
    setMetadata(allCourses.find(c => c.section_listings.split('-')[0] === node.id)); 

    const scale = 1.25; 
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2) 
      .scale(scale)                    
      .translate(-node.x, -node.y); 

    if (zoomRef.current) {
      svg.transition()
        .duration(500)
        .call(zoomRef.current.transform, transform);
    }
    
    if (!nodeAlertShown) {
      setTimeout(() => {
        alert(
          `You just clicked on a course!\n\n` +
          `What is being shown here?\n` +
          `• Similar courses are connected by a line.\n` +
          `• Word(s) on the line explain why they are similar.\n` +
          `• What does "similar" mean? Read our info page to learn more!\n\n`
        );
        setNodeAlertShown(true);
      }, 650); // 650ms delay
    }
  }

  // if it's of node selected's children, 
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
    if (containerDimensions.width === 0 || containerDimensions.height === 0) return;
  
    const { width, height } = containerDimensions;
    const svg = d3
      .select("#simulation-svg")
      .attr("width", width)
      .attr("height", height);

    if (!zoomRef.current) {
      zoomRef.current = d3.zoom()
        .scaleExtent([0.1, 3])
        .on("zoom", (event) => {
          d3.select("#zoom-group").attr("transform", event.transform);
        });
        
      const initialView = 0.15;
      const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2.3) 
        .scale(initialView); 

      svg.call(zoomRef.current);
      svg.call(zoomRef.current.transform, initialTransform);
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
    // .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(d => d.score ** -2 * 1000)
    )
    .force("collide", d3.forceCollide()
      .radius(40)    // ~ circle radius + padding
      .strength(2)   // how firmly to push apart
    )
    // .force("radial", d3.forceRadial(1000, width / 2, height / 2))

    // Links
    const linksGroup = d3.select(".links")
      .selectAll("g")
      .data(links)
      .join("g")

    // Nodes: each node is a <g>
    // Create one <g> per node and add a "node" class
    const nodeGroup = d3.select(".nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");

    // Append circle
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

    nodeGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")    
      .style("pointer-events", "none")
      .text(d => d.id);

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
      nodeGroup
        .attr("transform", (d) => {
          return `translate(${d.x},${d.y})`;
        });
    });

    return () => {
      simulation.stop();
      svg.selectAll(".links").remove(); // SHOULD WE CLEAN THESE UP IN OTHER PLACES?
      svg.selectAll(".nodes").remove();
      svg.selectAll(".zoom-group").remove();
    };

  }, [links, nodes, connectedNodes, containerDimensions]);

  // Once we have a "clicked" event => zoom in or out
  // OVERHERE
  useEffect(() => {
    if (selectedNode[0] === -1) {
      const node = nodes.find(n => n.id === selectedNode[1]);
      if (!node) return;
      if (nodeSelections[0] === selectedNode[1]) {
        doubleClickNode();
      } else {
        clickNewNode(node);
      }
    } else if (selectedNode[0] === -2) {
      const link = selectedNode[1];
      if (nodeSelections[0] === link.source.id) {
          const targetNode = nodes.find(n => n.id === link.target.id);
        if (!targetNode) return;
          clickNewNode(targetNode);
      } else {
        const sourceNode = nodes.find(n => n.id === link.source.id);
        if (!sourceNode) return;
        clickNewNode(sourceNode);
      }
    } else if(selectedNode[0] === -3) {
      const node = nodes.find(n => n.id === selectedNode[1]);
      if (!node) return;
      clickNewNode(node, 1);
    }else if (nodeSelections[0] === "") {
      setNodeSelections(["", selectedNode]); // For hover-based selection if needed.
    }
  }, [selectedNode]);
  

  // Redraw if hovered/clicked nodes
  useEffect(() => {
    refreshGraph();
  }, [nodeSelections]);

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
  function formatHighlightWords(wordString) {
    if (!wordString) return "";
    let trimmed = wordString.trim();
    const words = trimmed.split(/\s+/);
    return words.map(w => `"${w}"`).join(", ");
  }

  function parseLinkWords(rawWordString) {
    if (!rawWordString) return [];
    const cleaned = rawWordString.replace(/"/g, "");
    return cleaned.split(/\s+/).filter(Boolean);
  }  

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
            <input
              type="text"
              placeholder="Search by course name, description, or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
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
                        if (!savedAlertShown) {
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
            src={help_icon}
            className="buttons-on-graph help-button"
            onClick={() => alert(
              `What is being shown here?\n` +
              `• Similar courses are connected by a line.\n` +
              `• Word(s) on the line explain why they are similar.\n` +
              `• What does "similar" mean? Read our info page to learn more!\n\n` +
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
                    if (!savedAlertShown) {
                      alert("You just saved a course!\nSee it in your shopping cart.");
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