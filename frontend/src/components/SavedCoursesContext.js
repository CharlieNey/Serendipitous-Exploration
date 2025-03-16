/**
 * @file SavedCoursesContext.js
 * @description Creates state variable for a user's saved courses, makes it accessible across files.
 * @authors Kai, Willow
 * @date 3/12/25
 */

import React, { createContext, useState } from 'react';

export const SavedCoursesContext = createContext();

export const SavedCoursesProvider = ({ children }) => {
    const [savedCourses, setSavedCourses] = useState([]); // stores a list of a user's saved courses

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