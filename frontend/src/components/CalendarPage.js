import React, { useState, useContext, useEffect } from "react";
import "./CalendarPage.css";
import { useParams } from "react-router-dom";
import { SavedCoursesContext } from './SavedCoursesContext.js';
import shopping_cart_logo from '../images/shopping_cart_logo.png'; 
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

function Calendar({ setShowNavbar }, props) {
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const [expandedCourse, setExpandedCourse] = useState(null); // stores the course number of the currently expanded course (null by default)


  console.log("These are the saved courses (calendar page):")
  console.log(savedCourses)

  useEffect(() => {
      setShowNavbar(true);
  }, []);


  function parseDaysOfWeek(days) {
    const dayMapping = {
      M: '1',
      T: '2',
      W: '3',
      TH: '4',
      F: '5',
    };
  
    // split input string by comma + trim extra spaces
    const daysArray = days.split(',').map(day => day.trim());
  
    // map day abbreviations to number code
    const parsedDays = daysArray.map(day => dayMapping[day]);
  
    return parsedDays;
  }

  function parseTimeRange(timeRange) {
    // helper function to convert from 12h to 24h format
    function convertTo24HourFormat(time) {
      const [hours, minutes] = time.match(/(\d+):(\d+)(am|pm)/).slice(1, 3);
      let hours24 = parseInt(hours, 10);
  
      // convert a/pm to 24h
      if (time.includes('pm') && hours24 < 12) {
        hours24 += 12;
      }
  
      // fill to ensure two digits
      return `${String(hours24).padStart(2, '0')}:${minutes}:00`;
    }
  
    // split into start and end times
    const [startTime, endTime] = timeRange.split('-');
  
    // convert start and end times to 24h format
    const startTimeIn24 = convertTo24HourFormat(startTime);
    const endTimeIn24 = convertTo24HourFormat(endTime);
  
    return {
      startTime: startTimeIn24,
      endTime: endTimeIn24
    };
  }

  // map saved courses to events for the calendar
  const calendarEvents = savedCourses.map(course => ({
    title: course.course_number,
    // daysOfWeek: [1, 3, 5],
    daysOfWeek: parseDaysOfWeek(course.meeting_day),
    startTime: parseTimeRange(course.time).startTime,
    endTime: parseTimeRange(course.time).endTime
  }));

  console.log("calendar events created:")
  console.log(calendarEvents);
  

  return (
    <div className="calendar-page-container">

      <div className="sidebar"> 
        <div className="search-section"> 
        <h1>Your Saved Courses:</h1>
          {/* <input
            type="text"
            placeholder="Search by course name, description, or number" 
            value={searchTerm} // binds the input's value to the `searchTerm` state
            onChange={(e) => setSearchTerm(e.target.value)} // updates the `searchTerm` state whenever the user types in the search bar
            className="search-input" // applies styling from the CSS file
          /> */}

          {/* this is apparently something called conditional rendering where it shows different content depending on the state
          {isLoading ? (
            <p>Loading courses...</p> // displayed when `isLoading` is true (data is still being fetched)
          ) : searchTerm && courseList.length === 0 ? (
            <p>No courses found matching your search.</p> // displayed if there are no matching courses for the search term
          ) : ( */}
            <ul className="course-list"> {/* this is an unordered list of courses */}
              {savedCourses.map((course) => ( // `map` iterates over the `savedCourses` array and renders a list item for each course
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
          {/* )} */}
        </div>
        <div className="divider"></div> {/* divider for separation in the sidebar */}
      </div>

      <div className="calendar-section">
      <FullCalendar
        // plugins={[ dayGridPlugin ]}
        // initialView="dayGridWeek"
        plugins={[ timeGridPlugin ]}
        initialView="timeGridWeek"
        dayHeaderFormat={{ weekday: 'long' }}
        weekends={false}
        minTime="08:00:00"
        maxTime="18:00:00"

        headerToolbar={false}
        // headerToolbar={{
        //   start: 'title', 
        //   center: '',
        //   end: 'today prev,next' 
        // }}
        
        events={calendarEvents}
      />

    </div>

    </div>
  );
}

export default Calendar;
