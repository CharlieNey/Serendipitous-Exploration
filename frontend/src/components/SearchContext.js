import React, { createContext, useState, useEffect } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        const term = searchTerm.toLowerCase();
        const filteredCourses = courses.filter(course => {
          const description = course.description ? course.description.toLowerCase() : "";
          return (
            course.course_number.toLowerCase().includes(term) ||
            course.course_title.toLowerCase().includes(term) ||
            description.includes(term)
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
