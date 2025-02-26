// import { s } from '@fullcalendar/core/internal-common';
import React, { createContext, useState, useEffect } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const departmentMap = { // if lower search term LIKE departmentMap.value, then find class...
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

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/courses");
      const courses = await response.json();

      setAllCourses(courses);

      // filtered list for the sidebar.
      if (searchTerm === "") {
        setCourseList(courses);
      } else {
        const reverseDepartmentMap = Object.fromEntries(Object.entries(departmentMap).map(([acronym, fullName]) => [fullName.toLowerCase(), acronym.toLowerCase()]));
        
        const term = searchTerm.toLowerCase();
        const filteredCourses = courses.filter(course => {
          const description = course.description ? course.description.toLowerCase() : "";
          const sectionListings = course.section_listings.toLowerCase(); // course number and title
          const department = sectionListings.split(" ")[0].toLowerCase();

          const matchesAcronym = department.includes(term);
          const matchesFullName = departmentMap[department] && departmentMap[department].toLowerCase().includes(term);
          const reverseMatch = reverseDepartmentMap[term] === (department);
          const matchesTitleOrDescription = sectionListings.includes(term) || description.includes(term);

          return (
            matchesTitleOrDescription ||
            matchesAcronym ||
            matchesFullName ||
            reverseMatch
          );
        });
        setCourseList(filteredCourses);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  };


const fetchCourses2 = async () => {
  try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/courses");
      const courses = await response.json();

      setAllCourses(courses);

      if (searchTerm === "") {
          setCourseList(courses);
      } else {
          const reverseDepartmentMap = Object.fromEntries(Object.entries(departmentMap).map(([acronym, fullName]) => [fullName.toLowerCase(), acronym.toLowerCase()]));
  
          const term = searchTerm.toLowerCase();
          const filteredCourses = courses.filter(course => {
              const description = course.description ? course.description.toLowerCase() : "";
              const sectionListings = course.section_listings.toLowerCase(); // course number and title
              const department = sectionListings.split(" ")[0].toLowerCase();

              const matchesAcronym = department === term;
              const matchesFullName = departmentMap[department] && departmentMap[department].toLowerCase() === term;
              const reverseMatch = reverseDepartmentMap[term] === department;

              return (
                  sectionListings.includes(term) ||
                  description.includes(term) ||
                  matchesAcronym ||
                  matchesFullName ||
                  reverseMatch
              );
          });
          setCourseList(filteredCourses);
      }
      setIsLoading(false);
  } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
  }
};

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  return (
    <SearchContext.Provider
      value={{
        allCourses,  
        courseList,   // filtered data for the sidebar
        searchTerm,
        setSearchTerm,
        isLoading,
        fetchCourses
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
