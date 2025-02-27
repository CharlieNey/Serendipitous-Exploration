import { useContext } from "react";
import { GraphContext } from "../GraphContext.js";

const humList = [
  "AFST", "AMST", "ARBC", "ASLN", "ASST", "CHIN", "CLAS", "ECON", "EDUC",
  "CCST", "ENGL", "FREN", "GERM", "GRK", "GWSS", "HEBR", "HIST", "JAPN",
  "LATN", "LTAM", "MELA", "POSC", "RELG", "RUSS", "SOAN", "SPAN"
];

const stemList = [
  "BIOC", "BIOL", "CGSC", "CHEM", "GEOL", "STAT", "NEUR", "PHIL", "PSYC",
  "PHYS", "MATH", "LING", "ASTR", "CS"
];

const artList = ["THEA", "DANC", "ARTH", "ARTS", "ARCN", "CAMS", "MUSC"];

function getSubjectCode(course) {
  if (!course || !course.section_listings || typeof course.section_listings !== "string") {
    return null;
  }

  const spaceIdx = course.section_listings.indexOf(" ");
  if (spaceIdx < 0) {
    return null;
  }

  return course.section_listings.substring(0, spaceIdx);
}

function getStartHourAndMidday(course) {
  if (!course || !course.day_start_end || typeof course.day_start_end !== "string") {
    return [null, null];
  }

  const splits = course.day_start_end.split("|");
  if (splits.length < 2) {
    return [null, null];
  }

  const timePart = splits[1].trim();
  const colonIdx = timePart.indexOf(":");
  if (colonIdx < 0) {
    return [null, null];
  }

  const hourStr = timePart.substring(0, colonIdx).replace(/\D/g, ""); 
  const midday = timePart.slice(colonIdx).toUpperCase();
  let isAM = midday.includes("AM");
  let isPM = midday.includes("PM");

  let hourNum = parseInt(hourStr, 10);
  if (isNaN(hourNum)) {
    return [null, null];
  }

  return [hourNum, isAM ? "A" : isPM ? "P" : null];
}

export const QuizInfo = () => {
  const { departmentRecommendations } = useContext(GraphContext);

  function getAllDepartments() {
    return departmentRecommendations.map((item) => item.department);
  }

  function getAllDepartmentRecommendationFunctions() {
    return departmentRecommendations.map((item) => {
      const recs = item.recommendations;
      return function isInDepartments(course) {
        const subj = getSubjectCode(course);
        return subj ? recs.includes(subj) : false;
      };
    });
  }

  function isStem(course) {
    const subj = getSubjectCode(course);
    return subj ? stemList.includes(subj) : false;
  }

  function isHum(course) {
    const subj = getSubjectCode(course);
    return subj ? humList.includes(subj) : false;
  }

  function isArt(course) {
    const subj = getSubjectCode(course);
    return subj ? artList.includes(subj) : false;
  }

  function isEasy(course) {
    if (!course || !course.section_listings || typeof course.section_listings !== "string") {
      return false;
    }

    const spaceIndex = course.section_listings.indexOf(" ");
    if (spaceIndex < 0) {
      return false;
    }
    
    const level_code = course.section_listings.substring(spaceIndex + 1, spaceIndex + 2);
    return level_code === "1";
  }

  function isMedium(course) {
    if (!course || !course.section_listings || typeof course.section_listings !== "string") {
      return false;
    }
    const spaceIndex = course.section_listings.indexOf(" ");
    if (spaceIndex < 0) {
      return false;
    }
    const level_code = course.section_listings.substring(spaceIndex + 1, spaceIndex + 2);
    return level_code === "2";
  }

  function isHard(course) {
    if (!course || !course.section_listings || typeof course.section_listings !== "string") {
      return false;
    }
    const spaceIndex = course.section_listings.indexOf(" ");
    if (spaceIndex < 0) {
      return false;
    }
    const level_code = course.section_listings.substring(spaceIndex + 1, spaceIndex + 2);
    return level_code === "3";
  }

  function isChem(course) {
    const subj = getSubjectCode(course);
    return subj === "CHEM";
  }

  function isNotChem(course) {
    return !isChem(course);
  }

  function isMorning(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // morning => 8, 9, 10 AM
    return midday === "A" && [8, 9, 10].includes(hour);
  }

  function isAfternoon(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // afternoon => 11AM or 12/1 PM
    if (midday === "A" && hour === 11) return true;
    if (midday === "P" && (hour === 12 || hour === 1)) return true;
    return false;
  }

  function isLateAfternoon(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // late afternoon => 2, 3, 4, 5 PM
    return midday === "P" && [2, 3, 4, 5].includes(hour);
  }

  // Quizzes
  const Quiz_1 = {
    title: "Find Your Quest!",
    description: "Obtain a Spring 2025 Carleton course based on your past experience and personal preferences",
    questions: [
      {
        question: "In which department do you already have experience? Choose one!",
        choices: getAllDepartments(),
        type: "DropDown",
        filters: getAllDepartmentRecommendationFunctions()
      },
      {
        question: "You arrive at a crossroads offering three challenges, each with a different reward. Which path do you choose?",
        choices: ["EASY REWARD: $1000", "MODERATE REWARD: $2000", "HARD REWARD: $3000"],
        type: "MCQs",
        filters: [isEasy, isMedium, isHard]
      },
      {
        question: "Imagine you’re embarking on a journey. Choose your loyal companion who will be by your side through thick and thin.",
        choices: ["Brilliant Bird", "Watchful Whale", "Resilient Raccoon"],
        type: "MCQs",
        filters: [isMorning, isAfternoon, isLateAfternoon]
      }
    ]
  };

  // const Quiz_2 = {
  //   title: "Chemistry Courses",
  //   questions: [
  //     {
  //       question: "Do you want to take a Chemistry class?",
  //       choices: ["Yes", "No"],
  //       type: "MCQs",
  //       filters: [isChem, isNotChem]
  //     }
  //   ]
  // };

  return [Quiz_1];
};
