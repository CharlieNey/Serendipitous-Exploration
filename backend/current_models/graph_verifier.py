'''
Author: Charlie Ney
Description: This script counts the occurrences of each course as a source and a target in a directed graph stored in a CSV file.  
It reads the course connections from 'graph_connections.csv', computes the counts,  
and writes the results to 'course_counts.csv' with columns for each course's appearance as a source and target.  
'''


import csv
from collections import defaultdict

# initialize dictionaries to count occurrences
first_node_counts = defaultdict(int)
second_node_counts = defaultdict(int)

# read the CSV file
input_csv = 'data/graph_data/graph_connections.csv' 
output_csv = 'data/graph_data/course_counts.csv'  


with open(input_csv, mode='r', newline='', encoding='utf-8') as infile:
    reader = csv.reader(infile)
    next(reader, None)
    
    for row in reader:
        first_course = row[0].strip()
        second_course = row[1].strip()

        first_node_counts[first_course] += 1
        second_node_counts[second_course] += 1

with open(output_csv, mode='w', newline='', encoding='utf-8') as outfile:
    writer = csv.writer(outfile)
    
    # create the header
    writer.writerow(['Course', 'First Node Count', 'Second Node Count'])
    
    # get all unique courses
    all_courses = set(first_node_counts.keys()).union(set(second_node_counts.keys()))
    
    # write the counts for each course
    for course in sorted(all_courses):
        first_count = first_node_counts.get(course, 0)
        second_count = second_node_counts.get(course, 0)
        writer.writerow([course, first_count, second_count])

print(f"Course counts have been written to {output_csv}")