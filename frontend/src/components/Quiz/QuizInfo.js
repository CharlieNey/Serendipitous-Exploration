/**
 * @file QuizInfo.js
 * @description Stores quiz questions and effects.
 * @authors Kai, Markus, Zoey
 * @date 3/12/25
 * @reference - https://www.codevertiser.com/quiz-app-using-reactjs/
 */

import { useContext } from "react";
import { GraphContext } from "../GraphContext.js";

/**
* Returns the subject code of a course.
* @param {Object} course - the input course.
* @return {String} the course's subject code or null if there is an error.
*/
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

/**
* Returns the start hour and time of day (AM/PM) a course begins.
* @param {Object} course - the input course.
* @return {List} the course's start hour and afternoon code, or null if an error occurred.
*/
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

/**
* Returns the information of all quizzes.
* @return {List} a list of all the quiz information objects.
*/
export const QuizInfo = () => {
  const { departmentRecommendations } = useContext(GraphContext);

  // ZOEY I THINK THIS IS YOURS
  function getAllDepartments() {
    return departmentRecommendations.map((item) => item.department);
  }

  // ZOEY I THINK
  function getAllDepartmentRecommendationFunctions() {
    return departmentRecommendations.map((item) => {
      const recs = item.recommendations;
      return function isInDepartments(course) {
        const subj = getSubjectCode(course);
        return subj ? recs.includes(subj) : false;
      };
    });
  }

  /**
  * Returns true if a course is 100 level, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course is 100 level, false otherwise.
  */
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

  /**
  * Returns true if a course is 200 level, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course is 200 level, false otherwise.
  */
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

  /**
  * Returns true if a course is 300 level, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course is 300 level, false otherwise.
  */
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

  /**
  * Returns true if a course is takes place in the morning, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course takes place in the morning, false otherwise.
  */
  function isMorning(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // morning => 8, 9, 10 AM
    return midday === "A" && [8, 9, 10].includes(hour);
  }

  /**
  * Returns true if a course is takes place in the afternoon, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course takes place in the afternoon, false otherwise.
  */
  function isAfternoon(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // afternoon => 11AM or 12/1 PM
    if (midday === "A" && hour === 11) return true;
    if (midday === "P" && (hour === 12 || hour === 1)) return true;
    return false;
  }

  /**
  * Returns true if a course is takes place in the late afternoon, false otherwise.
  * @param {Object} course - the input course.
  * @return {Boolean} true if the course takes place in the late afternoon, false otherwise.
  */
  function isLateAfternoon(course) {
    const [hour, midday] = getStartHourAndMidday(course);
    // late afternoon => 2, 3, 4, 5 PM
    return midday === "P" && [2, 3, 4, 5].includes(hour);
  }

  // Defines a quiz object: containing title, description, and list of questions
  // Each question contains: the question being asked, the choices, the question type (ex. multiple choice), and the filter effects of each answer
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

  return [Quiz_1];
};
