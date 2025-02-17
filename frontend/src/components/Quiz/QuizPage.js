import React, { useState, useEffect, useContext } from "react";
import { Quizzes } from './QuizInfo.js'
import './Quiz.css'
import { SearchContext } from '../SearchContext.js';

// FROM: https://www.codevertiser.com/quiz-app-using-reactjs/#understand-the-logic-behind-the-quiz-app

// FUTURE STEPS:
// 2. ADD SELECT COURSE FUNCTIONALITY AT FINAL PAGE
// 3. ADD BRANCHING PATHS: SOME ANSWERS JUMP YOU TO SPECIFIC QUESTIONS
// 4. ADD FUNCTIONALITY FOR MULTIPLE SELECTION/BOOLEAN/USER INPUT

const QuizPage = ({ setShowNavbar }) => {
  const [isQuizSelected, setIsQuizSelected] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(Quizzes[0])
  const { allCourses } = useContext(SearchContext);
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState([])
  const [result, setResult] = useState([])

  useEffect(() => {
    setShowNavbar(true);
    setResult(allCourses)
  }, [allCourses]);

  const { title, description, questions } = selectedQuiz
  const { question, choices, type, filters } = questions[activeQuestion]

  function applyQuestionFilter(courses, matchesAnswer) {
    var output_courses = []

    for (var i in courses) {
      if (matchesAnswer(courses[i])) {
          output_courses.push(courses[i])
      }
    }
  
    return output_courses
  }

  function getFinalCourse() {
    if (result.length === 0) {
      return "No course"
    }
    return result[Math.floor(Math.random() * result.length)].section_listings.split('-')[0]
  }
  
  const onClickNext = () => {
    if (selectedAnswerIndex.length === 1) {
      setResult((prev) =>
        applyQuestionFilter(prev, filters[selectedAnswerIndex[0]])
      )
    } else if (selectedAnswerIndex.length >= 1){
      console.log("More than one selected")
    } else {
      console.log("Zero selected")
    }

    setSelectedAnswerIndex([])
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
    }
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

  // useEffect(() => {
  //   console.log(selectedAnswerIndex)
  // }, [selectedAnswerIndex]);

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
            <p>
              Your course: <span>{getFinalCourse()}</span>
            </p>
            <button onClick={() => setIsQuizSelected(false)}>Do Another Quiz</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage;