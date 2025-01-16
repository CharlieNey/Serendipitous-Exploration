import React, { useState, useEffect } from "react"; // useState manages component state; useEffect handles side effects (like data fetching)
import { Link } from 'react-router-dom'; // Link is used for navigation between pages
import "./ExplorePage.css"; 
import shopping_cart_logo from '../images/shopping_cart_logo.png'; 

function Explore() {
  // useState hooks to define component state variables
  const [searchTerm, setSearchTerm] = useState(""); // keeps track of the search input (empty by default)
  const [courseList, setCourseList] = useState([]); // stores the list of courses fetched from the server
  const [isLoading, setIsLoading] = useState(true); // loading state (true while data is being fetched)
  const [expandedCourse, setExpandedCourse] = useState(null); // stores the course number of the currently expanded course (null by default)

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
        if (searchTerm == "") {
            const response = await fetch("http://localhost:3001/api/courses");
            const response_json = await response.json();
            setCourseList(response_json);
            setIsLoading(false);
        } else {
            const response = await fetch("http://localhost:3001/mycourses/" + searchTerm);
            const response_json = await response.json();
            setCourseList(response_json);
            setIsLoading(false);
        }
    } catch (error) {
        console.error('Error fetching nodes:', error);
    }
  };

    // useEffect hook to fetch course data from the backend when the component loads
    useEffect(() => {
        fetchCourses();
    }, [searchTerm]);

  return (
    <div className="Explore">
      <div className="sidebar"> 
        <div className="search-section"> 
          <input
            type="text"
            placeholder="Search by course name, description, or number" 
            value={searchTerm} // binds the input's value to the `searchTerm` state
            onChange={(e) => setSearchTerm(e.target.value)} // updates the `searchTerm` state whenever the user types in the search bar
            className="search-input" // applies styling from the CSS file
          />

          {/* this is apparently something called conditional rendering where it shows different content depending on the state */}
          {isLoading ? (
            <p>Loading courses...</p> // displayed when `isLoading` is true (data is still being fetched)
          ) : searchTerm && courseList.length === 0 ? (
            <p>No courses found matching your search.</p> // displayed if there are no matching courses for the search term
          ) : (
            <ul className="course-list"> {/* this is an unordered list of courses */}
              {courseList.map((course) => ( // `map` iterates over the `courseList` array and renders a list item for each course
                <li key={course.course_number} className="course-item"> 
                  <div
                    className="course-summary"
                    onClick={() =>
                      setExpandedCourse(
                        expandedCourse === course.course_number ? null : course.course_number // toggles between expanding and collapsing course details
                      )
                    }
                  >
                    {/* display the course number and title */}
                    <strong>{course.course_number}:</strong> {course.course_title}
                  </div>
                  {expandedCourse === course.course_number && ( // show course details only if `expandedCourse` matches the current course number
                    <div className="course-details">
                      <em>{course.credits}</em> - {course.offered_term} <br />
                      Faculty: {course.faculty} <br /> 
                      Time: {course.time}, Location: {course.location} <br /> 
                      <p className="course-description">{course.description}</p>
                      <p><strong>Liberal Arts Requirements:</strong> {course.liberal_arts_requirements || "None"}</p> {/* displays Liberal arts requirements if available */}
                      <p><strong>Tags:</strong> {course.tags || "None"}</p> {/* displays tags if available */}
                      <p><strong>Prerequisites:</strong> {course.prerequisites || "None"}</p> {/* displays prereqs if available */}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="divider"></div> {/* divider for separation in the sidebar */}
      </div>
    </div>
  );
}

export default Explore; 
