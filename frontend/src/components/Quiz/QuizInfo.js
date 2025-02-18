import { useContext } from "react";
import { GraphContext } from '../GraphContext.js';

// Question Types
// 1. MCQs | DropDown | Multiple Choice | single

export const QuizInfo = () => {
  const { departmentRecommendations } = useContext(GraphContext);

  var humList = ['AFST', 'AMST', 'ARBC', 'ASLN', 
    'ASST', 'CHIN', 'CLAS', 'ECON', 'EDUC', 'CCST',
    'ENGL', 'FREN', 'GERM', 'GRK ', 'GWSS', 'HEBR', 'HIST', 'JAPN', 
    'LATN', 'LTAM', 'MELA', 'POSC', 'RELG', 'RUSS', 'SOAN', 'SPAN']

  var stemList = ['BIOC', 'BIOL', 'CGSC', 'CHEM', 'GEOL', 'STAT', 'NEUR',
    'PHIL', 'PSYC', 'PHYS', 'MATH', 'LING', 'ASTR', 'CS']

  var artList = ['THEA', 'DANC','ARTH', 'ARTS', 'ARCN', 'CAMS', 'MUSC']

  function getAllDepartments() {
    var depList = []
    for (var i in departmentRecommendations) {
      depList.push(departmentRecommendations[i].department)
    }
    return depList
  }

  function getAllDepartmentRecommendationFunctions() {
    var depRecFuncs = []
    for (var i in departmentRecommendations) {
      const currentRecs = departmentRecommendations[i].recommendations
      depRecFuncs.push(
        function isInDepartments(course) {
          var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
          return currentRecs.includes(subject_code)
        }
      )
    }
    return depRecFuncs
  }

  function isInDepartments (course, departments) {
    var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
    return departments.includes(subject_code)
  }

  function isStem(course) {
    var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
    return stemList.includes(subject_code)
  }

  function isHum(course) {
    var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
    return humList.includes(subject_code)
  }

  function isArt(course) {
    var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
    return artList.includes(subject_code)
  }

  function isEasy(course) {
    var level_code = course.section_listings.substring(course.section_listings.indexOf(" ") + 1, course.section_listings.indexOf(" ") + 2)
    return "1" === level_code
  }

  function isMedium(course) {
    var level_code = course.section_listings.substring(course.section_listings.indexOf(" ") + 1, course.section_listings.indexOf(" ") + 2)
    return "2" === level_code
  }

  function isHard(course) {
    var level_code = course.section_listings.substring(course.section_listings.indexOf(" ") + 1, course.section_listings.indexOf(" ") + 2)
    return "3" === level_code
  }

  function isChem(course) {
    return isInDepartments(course, ["CHEM"])
  }

  function isNotChem(course) {
    return !isInDepartments(course, ["CHEM"])
  }

  function isMorning(course) {
    var hour_code = course.day_start_end.split('|')[1].substring(1, course.day_start_end.split('|')[1].indexOf(":"))
    var midday = course.day_start_end.split('|')[1].substring((course.day_start_end.split('|')[1].indexOf(":") + 3) + 1, (course.day_start_end.split('|')[1].indexOf(":") + 5))

    return (((hour_code === "8") || (hour_code === "9") || (hour_code === "10")) && (midday === "A"))
  }

  function isAfternoon(course) {
    var hour_code = course.day_start_end.split('|')[1].substring(1, course.day_start_end.split('|')[1].indexOf(":"))
    var midday = course.day_start_end.split('|')[1].substring((course.day_start_end.split('|')[1].indexOf(":") + 3) + 1, (course.day_start_end.split('|')[1].indexOf(":") + 5))
    
    return ((((hour_code === "11")) && (midday === "A")) || (((hour_code === "12") || (hour_code === "1")) && (midday === "P")))
  }

  function isLateAfternoon(course) {
    var hour_code = course.day_start_end.split('|')[1].substring(1, course.day_start_end.split('|')[1].indexOf(":"))
    var midday = course.day_start_end.split('|')[1].substring((course.day_start_end.split('|')[1].indexOf(":") + 3) + 1, (course.day_start_end.split('|')[1].indexOf(":") + 5))
    return (((hour_code === "2") || (hour_code === "3") || (hour_code === "4") || (hour_code === "5")) && (midday === "P"))
  }

  const Quiz_1 = {
      title: "Choose your adventurer",
      description: "Quiz 1 description",
      questions: [
        // {
        //   question: 'What style of adventurer are you?',
        //   choices: ['Alchemist', 'Scribe', 'Craftsmen'],
        //   type: 'MCQs',
        //   filters: [isStem, isHum, isArt]
        // },
        {
          question: 'DEPARTMENT CHOICE MARKUS EDIT?',
          choices: getAllDepartments(),
          type: 'DropDown',
          filters: getAllDepartmentRecommendationFunctions()
        },
        {
          question: 'Choose a Quest Difficulty',
          choices: ['EASY REWARD: $1000', 'MODERATE REWARD: $2000', 'HARD REWARD: $3000'],
          type: 'MCQs',
          filters: [isEasy, isMedium, isHard]
        },
        {
          question: 'Choose a Companion',
          choices: ['Brilliant Bird', 'Watchful Whale', 'Resiliant Racoon'],
          type: 'MCQs',
          filters: [isMorning, isAfternoon, isLateAfternoon]
        },
      ],
  }

  const Quiz_2 = {
      title: "Just testing",
      description: "Quiz 2 description",
        questions: [
          {
            question: 'DISTINCT QUESTIONAIRRE',
            choices: ['STEM', 'HUMANITIES', 'ART'],
            type: 'DropDown',
            filters: [isStem, isHum, isArt]
          },
          {
            question: 'Choose a Quest Difficulty',
            choices: ['CHEM', 'NOT CHEM'],
            type: 'MCQs',
            filters: [isChem, isNotChem]
          },
        ],
  }
  
  return [Quiz_1, Quiz_2]
}

// export const QuizInfo;

// export const Quizzes = [QuizInfo.Quiz_1, QuizInfo.Quiz_2];