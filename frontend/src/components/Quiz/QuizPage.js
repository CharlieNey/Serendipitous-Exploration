import React, { useState, useEffect, useContext } from "react";
import { Quiz_1 } from './Quiz_1'
import './Quiz.css'
import { SearchContext } from '../SearchContext.js';

// FROM: https://www.codevertiser.com/quiz-app-using-reactjs/#understand-the-logic-behind-the-quiz-app

const QuizPage = ({ setShowNavbar }) => {
    const { allCourses } = useContext(SearchContext);
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    const [result, setResult] = useState([])

    useEffect(() => {
      setShowNavbar(true);
      setResult(allCourses)
    }, [allCourses]);
  
    const { questions } = Quiz_1
    const { question, choices, filters } = questions[activeQuestion]

    function applyQuestionFilter(courses, matchesAnswer) {
      var output_courses = []

      for (var i in courses) {
        if (matchesAnswer(courses[i])) {
            output_courses.push(courses[i])
        }
      }
    
      return output_courses
  }
  
    const onClickNext = () => {
      console.log(selectedAnswerIndex)
      setResult((prev) =>
        applyQuestionFilter(prev, filters[selectedAnswerIndex])
      )
      setSelectedAnswerIndex(null)
      if (activeQuestion !== questions.length - 1) {
        setActiveQuestion((prev) => prev + 1)
      } else {
        setActiveQuestion(0)
        setShowResult(true)
      }
    }
  
    const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)
  
    return (
      <div className="quiz-body">
        <div className="quiz-container">
          {!showResult ? (
            <div>
              <div>
                <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
                <span className="total-question">/{addLeadingZero(questions.length)}</span>
              </div>
              <h2>{question}</h2>
              <ul>
                {choices.map((answer, index) => (
                  <li
                    onClick={() => setSelectedAnswerIndex(index)}
                    key={answer}
                    className={selectedAnswerIndex === index ? 'selected-answer' : null}>
                    {answer}
                  </li>
                ))}
              </ul>
              <div className="flex-right">
                <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
                  {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          ) : (
            <div className="result">
              <h3>Result</h3>
              <p>
                Your course: <span>{result[0].course_number}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    )
}

export default QuizPage;