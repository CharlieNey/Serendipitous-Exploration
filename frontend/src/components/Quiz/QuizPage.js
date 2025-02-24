import React, { useState, useEffect, useContext } from "react";
import { QuizInfo } from './QuizInfo.js'
import './Quiz.css'
import { SearchContext } from '../SearchContext.js';
import { GraphContext } from '../GraphContext.js';
import { Link } from 'react-router-dom';
import add_icon from '../../images/add.png';
import { SavedCoursesContext } from '../SavedCoursesContext.js';

// FROM: https://www.codevertiser.com/quiz-app-using-reactjs/#understand-the-logic-behind-the-quiz-app

// FUTURE STEPS:
// 2. ADD SELECT COURSE FUNCTIONALITY AT FINAL PAGE
// 3. ADD BRANCHING PATHS: SOME ANSWERS JUMP YOU TO SPECIFIC QUESTIONS
// 4. ADD FUNCTIONALITY FOR MULTIPLE SELECTION/BOOLEAN/USER INPUT

const QuizPage = ({ setShowNavbar }) => {
  const [isQuizSelected, setIsQuizSelected] = useState(false)
  const { allCourses } = useContext(SearchContext);
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState([])
  const [result, setResult] = useState([])
  const { setSelectedNode } = useContext(GraphContext);
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);
  const Quizzes = QuizInfo()
  const [selectedQuiz, setSelectedQuiz] = useState(Quizzes[0])

  useEffect(() => {
    setShowNavbar(true);
    setResult(allCourses)
  }, [allCourses]);

  useEffect(() => {
    console.log(result)
  }, [result]);

  const { title, description, questions } = selectedQuiz
  const { question, choices, type, filters } = questions[activeQuestion]

  function getCourseByName(name) {
    for(var i in allCourses) {
      if (allCourses[i].section_listings.split('-')[0] === name) {
        return allCourses[i]
      }
    }
    return "COURSE NOT FOUND"
  }

  function applyQuestionFilter(courses, matchesAnswer) {
    var output_courses = []

    for (var i in courses) {
      if (matchesAnswer(courses[i])) {
          output_courses.push(courses[i])
      }
    }
    return output_courses
  }

  const getNextResult = () => {
    var nextResult = "Zero selected"
    if (selectedAnswerIndex.length === 1) {
      nextResult = applyQuestionFilter(result, filters[selectedAnswerIndex[0]])
    } else if (selectedAnswerIndex.length >= 1){
      nextResult = "More than one selected"
    }

    setSelectedAnswerIndex([])
    return nextResult
  }

  const setFinalResult  = (nextResult) => {
    if (nextResult.length === 0) {
      setResult("No Course")
      setSelectedNode([-1, ""])
    } else{
      const randIndex = Math.floor(Math.random() * nextResult.length)
      const resultName = nextResult[randIndex].section_listings.split('-')[0]
      setResult(resultName)
      setSelectedNode([-1, resultName])
    }
  }

  const incrementQuestion = (nextResult) => {
    if (activeQuestion !== questions.length - 1) {
      setResult(nextResult)
      setActiveQuestion((prev) => prev + 1)
    } else {
      setFinalResult(nextResult)
      setActiveQuestion(0)
      setShowResult(true)
    }
  }

  const onClickNext = () => {
    const nextResult = getNextResult()
    incrementQuestion(nextResult)
  }

  const startQuiz = (quiz) => {
    setResult(allCourses)
    setShowResult(false)
    setSelectedQuiz(quiz)
    setIsQuizSelected(true)
  }

  function getQuestionHTML() {
    if(type === "DropDown") {
      return (
        <div>
          <select id ="dropdown" onChange={(e) => setSelectedAnswerIndex([Number(e.target.value)])}>
            {choices.map((answer, index) => (
              <option
                value={index}>
                  {answer}
              </option>
            ))}
          </select>
          <div className="flex-right">
          <button onClick={onClickNext} disabled={selectedAnswerIndex.length === 0}>
            {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
        </div>)
    } else {
      return (
      <div>
        <ul>
          {choices.map((answer, index) => (
          <li
            onClick={() => setSelectedAnswerIndex([index])}
            key={answer}
            className={(selectedAnswerIndex.length !== 0 && selectedAnswerIndex[0] === index) ? 'selected-answer' : null}>
            {answer}
          </li>
        ))}
        </ul>
        <div className="flex-right">
          <button onClick={onClickNext} disabled={selectedAnswerIndex.length === 0}>
            {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>)
    }
  }

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="quiz-body">
      <div className="quiz-container">
        {!isQuizSelected ? (
          <div className="all-quizzes">
            <ul>
              <h2>Choose a quiz!</h2>
              {Quizzes.map((quiz) => (
                <li
                  onClick={() => startQuiz(quiz)}
                  key={quiz.title}>
                  {quiz.title}
                </li>
              ))}
            </ul>
          </div>
        ) : !showResult ? (
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div>
              <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
              <span className="total-question">/{addLeadingZero(questions.length)}</span>
            </div>
            <h2>{question}</h2>
            {getQuestionHTML()}
          </div>
        ) : (

          <div className="result">
            <h1>{title}</h1>
            <p>{description}</p>
            <h3>Result</h3>
            <p>Your course: <span>{result}</span></p>
            <div className="button-row">
              <button onClick={() => setIsQuizSelected(false)}>Do Another Quiz</button>

              <Link
                to="/graph"
                onClick={() => {
                  if (result !== "No Course") {
                    setSelectedNode([-1, result]);
                  }
                }}
              >
                <button>See In Graph</button>
              </Link>


              {/* <button onClick={() => setIsQuizSelected(false)}>Save to Calendar</button> */}
            </div>

            <div className="cart-button-row">
              <button
                onClick={() => {
                  if (result !== "No Course") {
                    const course = getCourseByName(result);
                    setSavedCourses((savedCourse) => {
                      console.log('Clicked course:', course);
                      // check if the course is already in the savedCourses
                      if (savedCourse.some(saved => saved.section_listings === course.section_listings)) {
                        // if course is already saved, remove it
                        const updatedCourses = savedCourse.filter(
                          savedCourse => savedCourse.section_listings !== course.section_listings
                        );
                        console.log('Updated courses after removal:', updatedCourses);
                        return updatedCourses;
                      } else {
                        // if not saved, add it
                        const updatedCourses = [...savedCourse, course];
                        console.log('Updated courses after addition:', updatedCourses);
                        return updatedCourses;
                      }
                    });
                  }
                }}
                className="add-to-calendar-button"
              >
                <img 
                  src={add_icon}
                  alt="Add to Calendar"
                  className={
                    (result === "No Course" ||
                    savedCourses.some(saved => saved.section_listings === getCourseByName(result).section_listings)
                    )
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
  )
}

export default QuizPage;