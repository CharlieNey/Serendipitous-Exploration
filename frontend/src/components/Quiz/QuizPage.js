/**
 * @file QuizPage.js
 * @description Creates quiz page and quiz functionality.
 * @authors Kai, Zoey
 * @date 3/12/25
 * @reference - https://www.codevertiser.com/quiz-app-using-reactjs/
 */

import React, { useState, useEffect, useContext } from "react";
import { QuizInfo } from "./QuizInfo.js";
import "./Quiz.css";
import { SearchContext } from "../SearchContext.js";
import { GraphContext } from "../GraphContext.js";
import { Link } from "react-router-dom";
import add_icon from "../../images/add.png";
import { SavedCoursesContext } from "../SavedCoursesContext.js";

import easy from "./easy.png";
import mid from "./mid.png";
import hard from "./hard.png";

import bird from "./bird.png";
import whale from "./whale.png";
import raccoon from "./raccoon.png";

/**
* Returns the quiz page's layout.
* @param {function} setShowNavbar - sets whether or not the navbar is visible on a page.
* @return {html} the quiz page's html.
*/
const QuizPage = ({ setShowNavbar }) => {
  const [activeQuestion, setActiveQuestion] = useState(0); // Stores the currently active question
  const [showResult, setShowResult] = useState(false); // Stores whether or not the result is being shown
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState([]); // Stores the indices of the selected answers
  const [result, setResult] = useState([]); // Stores potential quiz results or final quiz result
  const { allCourses } = useContext(SearchContext);
  const { setSelectedNode } = useContext(GraphContext);
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);

  const Quizzes = QuizInfo(); // Stores all quiz questions
  const [selectedQuiz, setSelectedQuiz] = useState(Quizzes[0]); // Stores currently selected quiz

  /**
   * Set the navbar to show on this page. Initialize result as all courses.
   * @return {void}
   */
  useEffect(() => {
    setShowNavbar(true);
    setResult(allCourses);
  }, [allCourses, setShowNavbar]);

  const { title, description, questions } = selectedQuiz; // Current title, description, and questions of selected quiz
  const { question, choices, type, filters } = questions[activeQuestion]; // the current question information

  // Helper to find a course by "DEPT 123" name

  /**
   * Get a course from its name encoding.
   * @param name - a course's name encoding
   * @return {Object} the course associated with the name encoding or a string detailling no course was found.
   */
  function getCourseByName(name) {
    for (var i in allCourses) {
      if (allCourses[i].section_listings.split("-")[0] === name) {
        return allCourses[i];
      }
    }
    return "COURSE NOT FOUND";
  }

  /**
   * Filter courses to contain only items matching the filter matchesAnswer.
   * @param {List} courses - list being filtered
   * @param {Function} matchesAnswer - a boolean filter function
   * @return {List} outputCourses - the object in courses satisfying the filter matchesAnswer.
   */
  function applyQuestionFilter(courses, matchesAnswer) {
    const outputCourses = [];
    for (var i in courses) {
      if (matchesAnswer(courses[i])) {
        outputCourses.push(courses[i]);
      }
    }
    return outputCourses;
  }

  /**
   * Based on the number of selected answers, filter the result down to match the selected filters.
   * @return {List} the list of potential results after performing filtering.
   */
  const getNextResult = () => {
    if (selectedAnswerIndex.length === 1) {
      return applyQuestionFilter(result, filters[selectedAnswerIndex[0]]);
    } else if (selectedAnswerIndex.length > 1) {
      return "More than one selected";
    } else {
      return "Zero selected";
    }
  };

  /**
   * Set result to an output course from possible results upon terminating the quiz.
   * @param {List} nextResult - the final list of possible results
   * @return {void}
   */
  const setFinalResult = (nextResult) => {
    if (!Array.isArray(nextResult) || nextResult.length === 0) {
      setResult("No Course");
      setSelectedNode([-1, ""]);
    } else {
      const randIndex = Math.floor(Math.random() * nextResult.length);
      const resultName = nextResult[randIndex].section_listings.split("-")[0];
      setResult(resultName);
      setSelectedNode([-1, resultName]);
    }
  };

  /**
   * Change the result and active question.
   * @param {List} nextResult - the list of possible result courses after the previous question's filter(s).
   * @return {void}
   */
  const incrementQuestion = (nextResult) => {
    if (activeQuestion < questions.length - 1) {
      setResult(nextResult);
      setActiveQuestion((prev) => prev + 1);
    } else {
      setFinalResult(nextResult);
      setActiveQuestion(0);
      setShowResult(true);
    }
  };

  /**
   * Update the question and result upon submitting a question's answer.
   * @return {void}
   */
  const onClickNext = () => {
    const nextResult = getNextResult();
    setSelectedAnswerIndex([]);
    incrementQuestion(nextResult);
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  const question2Images = [easy, mid, hard];
  const question3Images = [bird, whale, raccoon];

  return (
    <div className="quiz-body">
      <div className="quiz-container">
        {!showResult ? (
          <div className="quiz-content">
            <h1 className="quiz-title">{title}</h1>
            <p className="quiz-description">{description}</p>

            <div className="question-info">
              <span className="active-question-no">
                {addLeadingZero(activeQuestion + 1)}
              </span>
              <span className="total-question">
                /{addLeadingZero(questions.length)}
              </span>
            </div>

            <h2 className="question-text">{question}</h2>

            {/* If question uses DropDown, else MCQs */}
            {type === "DropDown" ? (
              <div className="dropdown-container">
                <select
                  className="question-dropdown"
                  value={
                    selectedAnswerIndex[0] === undefined
                      ? ""
                      : selectedAnswerIndex[0]
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSelectedAnswerIndex([]);
                    } else {
                      setSelectedAnswerIndex([Number(val)]);
                    }
                  }}
                >
                  <option value="" disabled className="dropdown-placeholder">
                    Select a department...
                  </option>
                  {choices.map((answer, index) => (
                    <option key={answer} value={index}>
                      {answer}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <ul className="answer-list">
                {choices.map((answer, index) => {
                  let thisImage = null;
                  if (activeQuestion === 1) {
                    thisImage = question2Images[index];
                  } else if (activeQuestion === 2) {
                    thisImage = question3Images[index];
                  }

                  return (
                    <li
                      key={answer}
                      onClick={() => setSelectedAnswerIndex([index])}
                      className={
                        selectedAnswerIndex.length &&
                        selectedAnswerIndex[0] === index
                          ? "selected-answer"
                          : ""
                      }
                    >
                      <div className="answer-text">{answer}</div>

                      {thisImage && (
                        <img
                          src={thisImage}
                          alt={answer}
                          className="answer-image"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="next-button-container">
              <button
                onClick={onClickNext}
                disabled={selectedAnswerIndex.length === 0}
              >
                {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="result">
            <h1 className="quiz-title">{title}</h1>
            <p className="quiz-description">{description}</p>

            <h3>Result</h3>
            <p>
              Your course: <span>{result}</span>
            </p>

            <div className="button-row">
              <button
                onClick={() => {
                  // Reset quiz so user can retake
                  setShowResult(false);
                  setActiveQuestion(0);
                  setSelectedAnswerIndex([]);
                  setResult(allCourses);
                }}
              >
                Do Another Quiz
              </button>

              <Link
                to="/graph"
                onClick={() => {
                  if (result !== "No Course" && typeof result === "string") {
                    setSelectedNode([-1, result]);
                  }
                }}
              >
                <button>See In Graph</button>
              </Link>
            </div>

            <div className="cart-button-row">
              <button
                onClick={() => {
                  if (result !== "No Course") {
                    const course = getCourseByName(result);
                    setSavedCourses((savedCourse) => {
                      // If the course is already saved, remove it; otherwise add it
                      if (
                        savedCourse.some(
                          (saved) =>
                            saved.section_listings === course.section_listings
                        )
                      ) {
                        return savedCourse.filter(
                          (item) =>
                            item.section_listings !== course.section_listings
                        );
                      }
                      return [...savedCourse, course];
                    });
                  }
                }}
                className="add-to-calendar-button"
              >
                <img
                  src={add_icon}
                  alt="Add to Calendar"
                  className={
                    result === "No Course" ||
                    (result !== "No Course" &&
                      savedCourses.some(
                        (saved) =>
                          saved.section_listings ===
                          getCourseByName(result).section_listings
                      ))
                      ? "grey-cart-button"
                      : ""
                  }
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
