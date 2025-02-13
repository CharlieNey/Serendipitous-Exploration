import csv
from collections import defaultdict

# Initialize dictionaries to count occurrences
first_node_counts = defaultdict(int)
second_node_counts = defaultdict(int)

# Read the CSV file
input_csv = 'data/graph_data/graph_connections.csv'  # Replace with your input CSV file name
output_csv = 'data/graph_data/course_counts.csv'  # Replace with your desired output CSV file name


with open(input_csv, mode='r', newline='', encoding='utf-8') as infile:
    reader = csv.reader(infile)
    
    # Skip the header if there is one
    next(reader, None)
    
    for row in reader:
        # Extract the first and second course names
        first_course = row[0].strip()
        #print("First course: ",first_course)
        second_course = row[1].strip()
        #print("Second Course: ", second_course)
        
        # Update the counts
        first_node_counts[first_course] += 1
        second_node_counts[second_course] += 1

        # print(f"First Course: {first_course}, Second Course: {second_course}")
        # print(f"First Node Count: {first_node_counts[first_course]}")
        # print(f"Second Node Count: {second_node_counts[second_course]}")
# Write the results to a new CSV file
with open(output_csv, mode='w', newline='', encoding='utf-8') as outfile:
    writer = csv.writer(outfile)
    
    # Write the header
    writer.writerow(['Course', 'First Node Count', 'Second Node Count'])
    
    # Get all unique courses
    all_courses = set(first_node_counts.keys()).union(set(second_node_counts.keys()))
    
    # Write the counts for each course
    for course in sorted(all_courses):
        first_count = first_node_counts.get(course, 0)
        second_count = second_node_counts.get(course, 0)
        writer.writerow([course, first_count, second_count])

print(f"Course counts have been written to {output_csv}")