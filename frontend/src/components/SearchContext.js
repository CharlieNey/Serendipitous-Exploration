import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [courseList, setCourseList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
        try {
          setIsLoading(true);
          // Fetch all courses
          const response = await fetch("http://localhost:3001/api/courses");
          const allCourses = await response.json();
          
          if (searchTerm === "") {
            // No filtering if searchTerm is empty
            setCourseList(allCourses);
          } else {
            // Convert searchTerm to lower case for case-insensitive matching
            const term = searchTerm.toLowerCase();
            const filteredCourses = allCourses.filter(course => {
              // Ensure description exists before checking (it might be null)
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
      

    return (
        <SearchContext.Provider
            value={{
                courseList,
                searchTerm,
                isLoading,
                setSearchTerm,
                fetchCourses
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};