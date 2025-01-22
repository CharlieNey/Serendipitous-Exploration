import React, { createContext, useState } from 'react';

export const SavedCoursesContext = createContext();

export const SavedCoursesProvider = ({ children }) => {
    const [savedCourses, setSavedCourses] = useState([]);

    return (
        <SavedCoursesContext.Provider
            value={{
                savedCourses,
                setSavedCourses
            }}
        >
            {children}
        </SavedCoursesContext.Provider>
    );
}