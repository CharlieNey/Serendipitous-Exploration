import csv

def extract_departments(csv_file):
    departments = set()
    
    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            if row:  # Ensure the row is not empty
                departments.add(row[0][:4])  # Extract the first 4 characters
    
    return sorted(departments)

# Example usage
csv_filename = "../data/course_data/filtered_courses/filtered_courses.csv"  # Replace with your CSV filename
departments_list = extract_departments(csv_filename)
print(departments_list)
