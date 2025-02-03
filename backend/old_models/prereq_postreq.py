import csv

# function to read the courses from the CSV file
def read_courses(file_path):
    courses = {}
    with open(file_path, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            course_number = row['Course Number']
            course_title = row['Course Title']
            prerequisites = row['Prerequisites'].split(';') if row['Prerequisites'] else []
            courses[course_number] = {
                'course number' : course_number,
                'title': course_title,
                'prerequisites': prerequisites,
                'postrequisites': []
            }
    return courses

# function to identify postrequisites (courses that list the current course as a prerequisite)
def identify_postrequisites(courses):
    for course_number, course_data in courses.items():
        for other_course_number, other_course_data in courses.items():
            if course_number in other_course_data['prerequisites']:
                courses[course_number]['postrequisites'].append(other_course_number)

# function to write the output CSV
def write_output_file(courses, output_file):
    with open(output_file, mode='w', newline='') as outfile:
        fieldnames = ['Course Number', 'Prerequisites', 'Postrequisites']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for course_number, course_data in courses.items():
            # join prerequisites and postrequisites into semicolon-separated strings
            prerequisites_str = ';'.join(course_data['prerequisites'])
            postrequisites_str = ';'.join(course_data['postrequisites'])
            
            writer.writerow({
                'Course Number': course_number,
                'Prerequisites': prerequisites_str,
                'Postrequisites': postrequisites_str
            })

def main(input_file, output_file):
    courses = read_courses(input_file) 
    identify_postrequisites(courses) 
    write_output_file(courses, output_file) 

input_file = 'data/courses.csv' 
output_file = 'data/prereq_postreq_output.csv' 
main(input_file, output_file)
