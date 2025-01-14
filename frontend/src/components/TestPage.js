import React, { useState, useEffect } from "react"; // useState manages component state; useEffect handles side effects (like data fetching)
import { Link } from 'react-router-dom'; // Link is used for navigation between pages
import "./TestPage.css"; 


function Display() {
    const [searchTerm, setSearchTerm] = useState(""); // keeps track of the search input (empty by default)
    const [courseList, setCourseList] = useState([]); // stores the list of courses fetched from the server

    const fetchCourses = async () => {
        try {
            if (searchTerm == "") {
                const response = await fetch("http://localhost:3001/api/courses");
                const response_json = await response.json();
                setCourseList(response_json);
            } else {
                const response = await fetch("http://localhost:3001/mycourses/" + searchTerm);
                const response_json = await response.json();
                setCourseList(response_json);
            }
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };

    // useEffect hook to fetch course data from the backend when the component loads
    useEffect(() => {
        fetchCourses();
    }, [searchTerm]);

    console.log("TEST1")
    console.log(courseList)

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
            </div>
            <div className="divider"></div> {/* divider for separation in the sidebar */}
          </div>
              {/* this is apparently something called conditional rendering where it shows different content depending on the state */}
              {searchTerm && courseList.length === 0 ? (
                <p>No courses found matching your search.</p> // displayed if there are no matching courses for the search term
              ) : (
                <ul className="course-list"> {/* this is an unordered list of courses */}
                  {courseList.map((course) => ( // `map` iterates over the `courseList` array and renders a list item for each course
                    <li key={course.course_number} className="course-item"> 
                      <div
                        className="course-summary"
                      >
                        {/* display the course number and title */}
                        <strong>{course.course_number}:</strong> {course.course_title}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
        </div>
      );
}

export default Display; 