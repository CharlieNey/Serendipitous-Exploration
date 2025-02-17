DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    course_subject TEXT,
    academic_period TEXT,
    section_listings TEXT,
    description TEXT,
    credits TEXT,
    capacity TEXT,
    reserved_seats TEXT,
    reserved_capacity_line TEXT,
    notes TEXT,
    day_start_end TEXT,
    course_tags TEXT,
    section_status TEXT
);

\copy courses(course_subject, academic_period, section_listings, description, credits, capacity, reserved_seats, reserved_capacity_line, notes, day_start_end, course_tags, section_status) FROM './data/course_data/filtered_classes.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS depRecs;
CREATE TABLE depRecs (
    Department TEXT,
    Top_5_Recommended TEXT
);

\copy depRecs (Department, Top_5_Recommended) FROM 'data/graph_data/recommended_departments.csv' DELIMITER  ',' CSV HEADER;