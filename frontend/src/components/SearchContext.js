/**
 * @file SearchContext.js
 * @description Loads and manages state variables facilitating the listing of all courses and managing the course search functionality. Allows other files to access these variables.
 * @authors Cathy, Kai, Willow, Zoey
 * @date 3/12/25
 */
import React, { createContext, useState, useEffect } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]); // stores a list all courses
  const [searchTerm, setSearchTerm] = useState(""); // stores the current search term
  const [courseList, setCourseList] = useState([]); // stores a list of courses resulting from the search term
  const [isLoading, setIsLoading] = useState(true); // stores whether or not requested data is loading

  const departmentMap = { // Maps department codes to their full names
    'AFST': 'African Studies',
    'AMST': 'American Studies',
    'ARBC': 'Arabic',
    'ARCN': 'Archaelogy',
    'ARTH': 'Art History',
    'ASLN': 'Asian Languages and Literatures',
    'ASST': 'Asian Studies',
    'ASTR': 'Astronomy',
    'BIOC': 'Biochemistry',
    'BIOL': 'Biology',
    'CHEM': 'Chemistry',
    'CHIN': 'Chinese',
    'CAMS': 'Cinema and Media Studies',
    'CLAS': 'Classics',
    'CGSC': 'Cognitive Science',
    'CS': 'Computer Science',
    'CCST': 'Cross-Culural Studies',
    'DANC': 'Dance',
    'DGAH': 'Digital Arts and Humanities',
    'ECON': 'Economics',
    'EDUC': 'Educational Studies',
    'ENGL': 'English',
    'ENTS': 'Environmental Studies',
    'EUST': 'European Studies',
    'FREN': 'French and Francophone Studies',
    'GWSS': 'Gender, Women\'s and Sextuality Studies',
    'GEOL': 'Geology',
    'GERM': 'German',
    'GRK': 'Greek',
    'HEBR': 'Hebrew',
    'HIST': 'History',
    'IDSC': 'Interdisciplinary Studies',
    'JAPN': 'Japanese',
    'LATN': 'Latin',
    'LTAM': 'Latin American Studies',
    'LING': 'Linguistics',
    'MATH': 'Mathetmatics',
    'STAT': 'Statistics',
    'MEST': 'Middle East Studies',
    'MELA': 'Middle Eastern Languages',
    'NEUR': 'Neuroscience',
    'PHIL': 'Philosophy',
    'PHYS': 'Physics',
    'POSC': 'Political Science',
    'PSYC': 'Psychology',
    'RELF': 'Religion',
    'RUSS': 'Russian',
    'SOAN': 'Sociology and Anthropology',
    'ARTS': 'Studio Arts',
    'SPAN': 'Spanish',
    'THEA': 'Theater and Dance',
  };

    // helper function to extract dept prefix (e.g. "MATH")

  /**
  * Returns the department prefix of a course name
  * @param {String} listing - the name of a course
  * @return {String} the department prefix of the course.
  */
    const getDepartment = (listing) => {
      return listing.split(" ")[0].toUpperCase();
    };

  /**
   * Initializes the list of all courses by fetching data from the API.
   * Filters courses based on the current search term and sorts them by department.
   * @return {void}
   */
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/courses");
      const courses = await response.json();
  
      setAllCourses(courses);
  
      let filteredCourses;
      if (searchTerm === "") {
        // if no search term, just show everything
        filteredCourses = courses;
      } else {
        // Create a reverse mapping of department names to acronyms
        const reverseDepartmentMap = Object.fromEntries(
          Object.entries(departmentMap).map(([acronym, fullName]) => [
            fullName.toLowerCase(),
            acronym.toLowerCase(),
          ])
        );
  
        const term = searchTerm.toLowerCase();
        // Filter courses based on several criteria:
        filteredCourses = courses.filter((course) => {
          // Lowercase the description if it exists
          const description = course.description
            ? course.description.toLowerCase()
            : "";
          // Lowercase the section listing and extract department code
          const sectionListings = course.section_listings.toLowerCase();
          const department = sectionListings.split(" ")[0].toLowerCase();
          // Check if the search term matches the department acronym,
          // full department name, or appears in the course's title/description.
          const matchesAcronym = department.includes(term);
          const matchesFullName =
            departmentMap[department] &&
            departmentMap[department].toLowerCase().includes(term);
          // Check if the search term matches the full department name in reverse mapping
          const reverseMatch = reverseDepartmentMap[term] === department;
          // Check if the search term appears in the course's title or description
          const matchesTitleOrDescription =
            sectionListings.includes(term) || description.includes(term);
  
          return (
            matchesTitleOrDescription ||
            matchesAcronym ||
            matchesFullName ||
            reverseMatch
          );
        });
      }
  
      // sort the filteredCourses by their department before setting them in state
      filteredCourses.sort((a, b) =>
        getDepartment(a.section_listings).localeCompare(
          getDepartment(b.section_listings)
        )
      );
  
      // update state with the now-sorted array
      setCourseList(filteredCourses);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  };

  // useEffect to fetch all courses when the component mounts
  // and whenever the search term changes
  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  return (
    <SearchContext.Provider
      value={{
        allCourses,  // all courses fetched from the API
        courseList,   // filtered data for the sidebar
        searchTerm, // current search term
        setSearchTerm, // function to update the search term
        isLoading, // loading state for the API request
        fetchCourses
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
