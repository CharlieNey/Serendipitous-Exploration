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

const QuizPage = ({ setShowNavbar }) => {
  const [isQuizSelected, setIsQuizSelected] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState([]);
  const [result, setResult] = useState([]);
  const { allCourses } = useContext(SearchContext);
  const { setSelectedNode } = useContext(GraphContext);
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);

  const Quizzes = QuizInfo();
  const [selectedQuiz, setSelectedQuiz] = useState(Quizzes[0]);

  useEffect(() => {
    setShowNavbar(true);
    setResult(allCourses);
  }, [allCourses, setShowNavbar]);

  useEffect(() => {
    console.log("Current result:", result);
  }, [result]);

  const { title, description, questions } = selectedQuiz;
  const { question, choices, type, filters } = questions[activeQuestion];

  // Helper to find a course by "DEPT 123" name
  function getCourseByName(name) {
    for (var i in allCourses) {
      if (allCourses[i].section_listings.split("-")[0] === name) {
        return allCourses[i];
      }
    }
    return "COURSE NOT FOUND";
  }

  // Filter logic
  function applyQuestionFilter(courses, matchesAnswer) {
    const outputCourses = [];
    for (var i in courses) {
      if (matchesAnswer(courses[i])) {
        outputCourses.push(courses[i]);
      }
    }
    return outputCourses;
  }

  const getNextResult = () => {
    if (selectedAnswerIndex.length === 1) {
      return applyQuestionFilter(result, filters[selectedAnswerIndex[0]]);
    } else if (selectedAnswerIndex.length > 1) {
      return "More than one selected";
    } else {
      return "Zero selected";
    }
  };

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
