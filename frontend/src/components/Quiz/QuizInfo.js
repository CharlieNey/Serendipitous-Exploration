// // Question Types
// // 1. MCQs | Multiple Choice | single
// var humList = ['AFST', 'AMST', 'ARBC', 'ASLN', 
//   'ASST', 'CHIN', 'CLAS', 'ECON', 'EDUC', 'CCST',
//   'ENGL', 'FREN', 'GERM', 'GRK ', 'GWSS', 'HEBR', 'HIST', 'JAPN', 
//   'LATN', 'LTAM', 'MELA', 'POSC', 'RELG', 'RUSS', 'SOAN', 'SPAN']

// var stemList = ['BIOC', 'BIOL', 'CGSC', 'CHEM', 'GEOL', 'STAT', 'NEUR',
//   'PHIL', 'PSYC', 'PHYS', 'MATH', 'LING', 'ASTR', 'CS']

// var artList = ['THEA', 'DANC','ARTH', 'ARTS', 'ARCN', 'CAMS', 'MUSC']

// // function MostRecomendedDepartment(chosen_course) {
// //   var MostRecomended = []
// //   var courseCount = []
// //   // Save all recomended courses based on department of chosen Course to count_courses
// //   // save top 2,3 departments from course count to Most Recomended
// //   // return only courses which are part of the top 2,3 departments
// //   var subject_code = course.section_listings.split('-')[0].substring(0, course.section_listings.split('-')[0].indexOf(" "))
// //   return stemList.includes(subject_code)
// // }

// function isHum(course) {
//   var subject_code = course.section_listings.split('-')[0].substring(0, course.section_listings.split('-')[0].indexOf(" "))
//   return humList.includes(subject_code)
// }

// function isArt(course) {
//   var subject_code = course.section_listings.split('-')[0].substring(0, course.section_listings.split('-')[0].indexOf(" "))
//   return artList.includes(subject_code)
// }

// function isEasy(course) {
//   var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
//   return "1" === subject_code
// }

// function isMedium(course) {
//   var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
//   return "2" === subject_code
// }

// function isHard(course) {
//   var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
//   return "3" === subject_code
// }

// function isChem(course) {
//   var subject_code = course.section_listings.split('-')[0].substring(0, course.section_listings.split('-')[0].indexOf(" "))
//   return "CHEM" === subject_code
// }

// function isNotChem(course) {
//   var subject_code = course.section_listings.split('-')[0].substring(0, course.section_listings.split('-')[0].indexOf(" "))
//   return "CHEM" !== subject_code
// }
// function timeCheck(course) {
//   var subject_code = course.day_start_end.split('|')[1].substring(0, course.day_start_end.split('|')[1].indexOf(":"))
//   var midday = course.day_start_end.split('|')[1].substring((course.time.indexOf(":") + 3), (course.day_start_end.split('|')[1].indexOf(":") + 5))

//   if (((subject_code === "8") || (subject_code === "9") || (subject_code === "10")) && (midday === "am")) 
//     {
//     return subject_code;
//     }

//   else if ((((subject_code === "11")) && (midday === "am")) ||
//    (((subject_code === 12) || (subject_code === 1)) && (midday === "pm"))) 
//     {
//     return subject_code;
//     }

//   else if (((subject_code === "2") || (subject_code === "3") || (subject_code === "4") || (subject_code === "5")) 
//     && (midday === "pm")) 
//     {
//     return subject_code;
//     }

//   else 
//     {
//     return "time outside of bounds";
//     }
//   }

// const Quiz_1 = {
//     title: "Choose your adventurer",
//     description: "Quiz 1 description",
//     questions: [
//       {
//         question: 'What style of adventurer are you?',
//         choices: ['Alchemist', 'Scribe', 'Craftsmen'],
//         type: 'MCQs',
//         filters: [isHum, isArt]
//       },
//       {
//         question: 'Choose a Quest Difficulty',
//         choices: ['EASY REWARD: $1000', 'MODERATE REWARD: $2000', 'HARD REWARD: $3000'],
//         type: 'MCQs',
//         filters: [isEasy, isMedium, isHard]
//       },
//       {
//         question: 'Choose a Companion',
//         choices: ['Brilliant Bird', 'Watchful Whale', 'Resiliant Racoon'],
//         type: 'MCQs',
//         filters: [timeCheck, timeCheck, timeCheck]
//       },
//     ],
//   }

// const Quiz_2 = {
//     title: "Just testing",
//     description: "Quiz 2 description",
//       questions: [
//         {
//           question: 'DISTINCT QUESTIONAIRRE',
//           choices: ['STEM', 'HUMANITIES', 'ART'],
//           type: 'MCQs',
//           filters: [ isHum, isArt]
//         },
//         {
//           question: 'Choose a Quest Difficulty',
//           choices: ['CHEM', 'NOT CHEM'],
//           type: 'MCQs',
//           filters: [isChem, isNotChem]
//         },
//       ],
//     }

// export const Quizzes = [Quiz_1, Quiz_2];

// Question Types
// 1. MCQs | DropDown | Multiple Choice | single
var humList = ['AFST', 'AMST', 'ARBC', 'ASLN', 
  'ASST', 'CHIN', 'CLAS', 'ECON', 'EDUC', 'CCST',
  'ENGL', 'FREN', 'GERM', 'GRK ', 'GWSS', 'HEBR', 'HIST', 'JAPN', 
  'LATN', 'LTAM', 'MELA', 'POSC', 'RELG', 'RUSS', 'SOAN', 'SPAN']

var stemList = ['BIOC', 'BIOL', 'CGSC', 'CHEM', 'GEOL', 'STAT', 'NEUR',
  'PHIL', 'PSYC', 'PHYS', 'MATH', 'LING', 'ASTR', 'CS']

var artList = ['THEA', 'DANC','ARTH', 'ARTS', 'ARCN', 'CAMS', 'MUSC']

// course.course_number.substring... is now course.section_listings.split('-')[0].substring(...) because of how the new csv is.
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
  var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
  return "1" === subject_code
}

function isMedium(course) {
  var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
  return "2" === subject_code
}

function isHard(course) {
  var subject_code = course.section_listings.split('-')[0].substring((course.section_listings.split('-')[0].indexOf(" ") + 1), (course.section_listings.split('-')[0].indexOf(" ") + 2))
  return "3" === subject_code
}

function isChem(course) {
  var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
  return "CHEM" === subject_code
}

function isNotChem(course) {
  var subject_code = course.section_listings.substring(0, course.section_listings.indexOf(" "))
  return "CHEM" !== subject_code
}
function timeCheck(course) {
  var subject_code = course.day_start_end.split('|')[1].substring(0, course.day_start_end.split('|')[1].indexOf(":"))
  var midday = course.day_start_end.split('|')[1].substring((course.day_start_end.split('|')[1].indexOf(":") + 3), (course.day_start_end.split('|')[1].indexOf(":") + 5))

  if (((subject_code === "8") || (subject_code === "9") || (subject_code === "10")) && (midday === "am")) 
    {
    return subject_code;
    }

  else if ((((subject_code === "11")) && (midday === "am")) ||
   (((subject_code === 12) || (subject_code === 1)) && (midday === "pm"))) 
    {
    return subject_code;
    }

  else if (((subject_code === "2") || (subject_code === "3") || (subject_code === "4") || (subject_code === "5")) 
    && (midday === "pm")) 
    {
    return subject_code;
    }

  else 
    {
    return "time outside of bounds";
    }
  }

const Quiz_1 = {
    title: "Choose your adventurer",
    description: "Quiz 1 description",
    questions: [
      {
        question: 'What style of adventurer are you?',
        choices: ['Alchemist', 'Scribe', 'Craftsmen'],
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
        filters: [timeCheck, timeCheck, timeCheck]
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

export const Quizzes = [Quiz_1, Quiz_2];