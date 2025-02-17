import React, { useState, useContext, useEffect, startTransition, useRef } from "react";
import "./CalendarPage.css";
import { useParams } from "react-router-dom";
import { SavedCoursesContext } from './SavedCoursesContext.js';
import shopping_cart_logo from '../images/shopping_cart_logo.png'; 
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

function Calendar({ setShowNavbar }, props) {
  const {savedCourses, setSavedCourses} = useContext(SavedCoursesContext);
  const [expandedCourse, setExpandedCourse] = useState(null); // stores the course number of the currently expanded course (null by default)
  const courseRefs = useRef({}); //ref to track each course

  console.log("React version:");
  console.log(React.version);
  console.log("These are the saved courses (calendar page):")
  console.log(savedCourses)

  useEffect(() => {
      setShowNavbar(true);
  }, []); 

  // scroll to the expanded course when it is clicked
  useEffect(() => {
    if (expandedCourse && courseRefs.current[expandedCourse]) {
      courseRefs.current[expandedCourse].scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Align at the top of the viewport
      });
    }
  }, [expandedCourse]);


  function parseDaysOfWeek(days) {
    const dayMapping = {
      M: '1',
      T: '2',
      W: '3',
      TH: '4',
      F: '5',
    };
  
    // split input string by comma + trim extra spaces
    // const daysArray = days.split(',').map(day => day.trim());
    const daysArray = days.map(day => day.trim());
  
    // map day abbreviations to number code
    const parsedDays = daysArray.map(day => dayMapping[day]);
  
    return parsedDays;
  }

  function parseTimeRange(timeRange) {
    // helper function to convert from 12h to 24h format
    function convertTo24HourFormat(time) {
      const [, hours, minutes, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/);
      let hours24 = parseInt(hours, 10);
  
      // convert a/pm to 24h
      if (period.includes('PM') && hours24 < 12) {
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


  function parseSchedule(day_start_end) {
  // split by line breaks
  const lines = day_start_end.split('\n\n');
  let allSchedules = [];
  // let daysOfWeek = [];
  // let timeRange = '';
  
  // parse each line
  lines.forEach(line => {
    const [days, time] = line.split(' | ');
    
    // const [startTime, endTime] = timeRange.split(' - ');

    // extract days of the week
    let daysOfWeekTemp = [];
    if (days.includes('M')) daysOfWeekTemp.push('M');
    if (days.includes('T')) daysOfWeekTemp.push('T');
    if (days.includes('W')) daysOfWeekTemp.push('W');
    if (days.includes('TH')) daysOfWeekTemp.push('TH');
    if (days.includes('F')) daysOfWeekTemp.push('F');

    let timeRange = time;
    let daysOfWeek = daysOfWeekTemp
    allSchedules.push({
      DaysOfWeek: parseDaysOfWeek(daysOfWeek),
      startTime: parseTimeRange(timeRange).startTime,
      endTime: parseTimeRange(timeRange).endTime
      });
    })

    console.log("allSchedules:")
    console.log(allSchedules)

    return allSchedules;
  }

  const calendarEvents = savedCourses.map(course => {
    const allSchedule = parseSchedule(course.day_start_end);

    return allSchedule.map(schedule => {
      return {
        title: course.section_listings,
        daysOfWeek: schedule.DaysOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      };
    })
  }).flat();
  

  console.log("calendar events created:")
  console.log(calendarEvents);
  

  return (
    
    <div className="CalendarPage">

      <div className="content-container">

        <div className="scroll-sidebar"> 

          <div className="search-section"> 
            <h1>Your Saved Courses:</h1>
              <ul className="course-list"> {/* this is an unordered list of courses */}
                {savedCourses.map((course) => ( // `map` iterates over the `savedCourses` array and renders a list item for each course
                  <li key={course.section_listings} className="course-item"> 
                    <button
                      onClick={() => {
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

                    <div
                      className="course-summary"
                      ref={(el) => { courseRefs.current[course.section_listings] = el; }} // assign ref to each course
                      onClick={() =>
                        setExpandedCourse(
                          expandedCourse === course.section_listings ? null : course.section_listings // toggles between expanding and collapsing course details
                        )
                      }
                    >
                      {/* display the course number and title */}
                      <strong>{course.section_listings}:</strong> {course.course_title}
                    </div>
                    {expandedCourse === course.section_listings && ( // show course details only if expandedCourse matches the current course number
                      <div 
                      className="course-details"
                      onClick={() =>
                        setExpandedCourse(
                          expandedCourse === course.section_listings ? null : course.section_listings // toggles between expanding and collapsing course details
                        )
                      }
                      >
                        <p><strong>Credits:</strong> {course.credits}</p>
                        <p><strong>Description:</strong> {course.description}</p>
                        <p><strong>Liberal Arts Requirements:</strong> {course.course_tags}</p>
                        <p><strong>Meeting Day:</strong> {course.day_start_end.split('|')[0]}</p>
                        <p><strong>Time:</strong> {course.day_start_end.split('|')[1]}</p>
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
            plugins={[ timeGridPlugin ]}
            initialView="timeGridWeek"
            dayHeaderFormat={{ weekday: 'long' }}
            weekends={false}
            slotMinTime="08:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            headerToolbar={false}
            expandRows={true}
            
            events={calendarEvents}

            // eventColor="#003069"

            // set clicked course (to be expanded)
            eventClick={(info) => {
              const clickedCourse = info.event.title;
              setExpandedCourse(
                expandedCourse === clickedCourse ? null : clickedCourse // toggle the expanded course
              );
            }}

            // color clicked course
            eventDidMount={(info) => {
              const eventTitle = info.event.title;
              if (eventTitle === expandedCourse) {
                info.el.style.backgroundColor = "rgb(242, 148, 24)";
                // info.el.style.backgroundColor = " #FFD24F";
                info.el.style.borderColor = "rgb(242, 148, 24)";
              }
            }}
            
          />
        </div>

      </div>

    </div>
  );
}

export default Calendar;
