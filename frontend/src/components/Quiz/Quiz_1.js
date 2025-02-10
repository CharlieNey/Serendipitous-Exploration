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

function isChem(course) {
  var subject_code = course.course_number.substring(0, course.course_number.indexOf(" "))
  return "CHEM" === subject_code
}

function isNotChem(course) {
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
        question: 'Chem or nah?',
        choices: ['Chem all the way!!!', 'Hard pass'],
        type: 'MCQs',
        filters: [isChem, isNotChem]
      },
    ],
  }