DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    course_number TEXT,
    course_title TEXT,
    credits TEXT,
    description TEXT,
    offered_term TEXT,
    liberal_arts_requirements TEXT,
    tags TEXT,
    prerequisites TEXT,
    faculty TEXT,
    meeting_day TEXT,
    location TEXT,
    time TEXT
);

\copy courses(course_number, course_title, credits, description, offered_term, liberal_arts_requirements, tags, prerequisites, faculty, meeting_day, location, time) FROM 'data/course_data/filtered_courses/filtered_courses.csv' DELIMITER ',' CSV HEADER;