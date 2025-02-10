// Question Types
// 1. MCQs | Multiple Choice | single

function isStem(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return ["CS", "MATH", "CHEM"].includes(subject_code)
}

function isHum(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return ["AMST", "ENGL", "HIST"].includes(subject_code)
}

function isArt(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return ["MUSC", "ARTS"].includes(subject_code)
}

function isEasy(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return "CHEM" === subject_code
}

function isMedium(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return "CHEM" !== subject_code
}

function isHard(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return "CHEM" !== subject_code
}


export const Quiz_1 = {
    questions: [
      {
        question: 'What style of adventurer are you?',
        choices: ['Alchemist', 'Scribe', 'Wizard'],
        type: 'MCQs',
        filters: [isStem, isHum, isArt]
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
        //filters: [isEarly, isMiddle, isLate]
      },
    ],
  }