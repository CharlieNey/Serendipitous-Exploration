import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [courseList, setCourseList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
    try {
        setIsLoading(true);
        if (searchTerm === "") {
            const response = await fetch("http://localhost:3001/api/courses");
            const response_json = await response.json();
            setCourseList(response_json);
            setIsLoading(false);
        } else {
            const response = await fetch("http://localhost:3001/mycourses/" + searchTerm);
            const response_json = await response.json();
            setCourseList(response_json);
            setIsLoading(false);
        }
    } catch (error) {
        console.error('Error fetching nodes:', error);
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