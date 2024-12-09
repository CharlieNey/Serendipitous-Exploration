import React from "react";
import "./CalendarPage.css";
import { useParams } from "react-router-dom";

function Calendar(props) {
  // const { id, name } = props.match.params;
  const { id, name } = useParams()

  return (
    <div className="calendar-page-container">
      <h1>Saved Courses:</h1>
      <li className="saved-courses">
        {id} - {decodeURIComponent(name)}
      </li>
    </div>
  );
}

export default Calendar;
