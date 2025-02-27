"""
This script filters course data from a CSV file based on specific criteria.  
It removes courses that contain "OCS" in the "Notes" column or have an empty "Description" field.  
Only courses with section numbers in the "good_sections" list are retained,  
while certain courses listed in "bad_classes" are excluded.  
The filtered data is saved to a new CSV file, and the total count of retained courses is printed.  
"""
import csv

def filter_courses(input_file, output_file):
    good_sections = {"-00", "-01", "-51", "-52"}  # allowed section suffixes
    excluded_courses = {"GEOL 230-51", "EDUC 395", "ARTS 298", "ENGL 395", "GWSS 398"}  # courses to exclude
    count = 0  # Counter for retained courses

    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
            writer.writeheader()  # Write CSV header

            # Process each row
            for row in reader:
                section_listings = row['Section Listings']
                description = row['Description'].strip()
                notes = row['Notes']

                # Apply filtering conditions
                if "OCS" in notes or not description:
                    continue  # Skip courses with "OCS" in notes or empty descriptions
                
                if any(course in section_listings for course in excluded_courses):
                    continue  # Skip explicitly excluded courses

                if any(section in section_listings for section in good_sections):
                    writer.writerow(row)  # Write valid course to output
                    count += 1

    print(f"Filtered {count} courses.")

# Specify file paths
input_csv = 'data/course_data/classes.csv'
output_csv = 'data/course_data/filtered_classes.csv'

filter_courses(input_csv, output_csv)
print(f"Filtered courses have been saved to {output_csv}")
