import React, { useState, useEffect, useContext } from "react"; // useState manages component state; useEffect handles side effects (like data fetching)
import { Link } from 'react-router-dom'; // Link is used for navigation between pages
import "./ExplorePage.css"; 
import shopping_cart_logo from '../images/shopping_cart_logo.png'; 
import { SavedCoursesContext } from './SavedCoursesContext.js';
import { SearchContext } from './SearchContext.js';

function Explore() {
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const {courseList, searchTerm, isLoading, setSearchTerm, fetchCourses} = useContext(SearchContext);
  const [expandedCourse, setExpandedCourse] = useState(null); // stores the course number of the currently expanded course (null by default)

  console.log("These are the saved courses (explore page):")
  console.log(savedCourses)

    // useEffect hook to fetch course data from the backend when the component loads
    useEffect(() => {
        fetchCourses();
    }, [searchTerm]);

  return (
    <div className="Explore">
      <div className="calendar-button">
        <Link to="/calendar">
            <img src={shopping_cart_logo} alt="Go to Calendar" />
        </Link>
      </div>
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
                  <button
                    onClick={() => {
                      setSavedCourses((savedCourse) => {
                        console.log('Clicked course:', course);
                        // check if the course is already in the savedCourses
                        if (savedCourse.some(saved => saved.course_number === course.course_number)) {
                          // if course is already saved, remove it
                          const updatedCourses = savedCourse.filter(savedCourse => savedCourse.course_number !== course.course_number);
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
                      className={savedCourses.some(saved => saved.course_number === course.course_number) ? "grey-cart-button" : ""}
                    />
                  </button>
                  
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
                    <div 
                    className="course-details"
                    onClick={() =>
                      setExpandedCourse(
                        expandedCourse === course.course_number ? null : course.course_number // toggles between expanding and collapsing course details
                      )
                    }
                    >
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
