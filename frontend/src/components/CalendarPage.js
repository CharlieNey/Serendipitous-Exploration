// import React from "react";
// import "./CalendarPage.css";
// import { useParams } from "react-router-dom";

// function Calendar(props) {
//   // const { id, name } = props.match.params;
//   const { id, name } = useParams()

//   return (
//     <div className="calendar-page-container">
//       <h1>Saved Courses:</h1>
//       <li className="saved-courses">
//         {id} - {decodeURIComponent(name)}
//       </li>
//     </div>
//   );
// }

// export default Calendar;

import { useLocation } from 'react-router-dom';

function CalendarPage() {
  const location = useLocation();  // Get the current location
  const { savedCourses } = location.state   // Extract savedCourses from location state

  console.log(savedCourses);  // Check if the state is coming through correctly


  return (
    <div className="CalendarPage">
      <h1>Your Calendar</h1>
      {savedCourses.length === 0 ? (
        <p>No courses added to calendar yet.</p>
      ) : (
        <ul>
          {savedCourses.map((course, index) => (
            <li key={index}>
              {course.course_number}: {course.course_title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CalendarPage;

