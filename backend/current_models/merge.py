import csv

def process_section_listings(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
         open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            if 'Section Listings' in row:
                # Remove everything after '-0' and also remove '-0' itself
                section_listing = row['Section Listings']
                if '-0' in section_listing:
                    row['Section Listings'] = section_listing.split('-0')[0]
            
            writer.writerow(row)

def process_course_titles(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
         open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            if 'Course Number' in row:
                # Remove everything after '-0' and also remove '-0' itself
                section_listing = row['Course Number']
                if '.0' in section_listing:
                    row['Course Number'] = section_listing.split('.0')[0]
            
            writer.writerow(row)

def add_prequisites_column(source_file, target_file, output_file):
    # Read the source CSV into a dictionary keyed by "Section Titles"
    prerequisites_map = {}
    with open(source_file, mode='r', newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        for row in reader:
            section_title = row['Course Number']
            prerequisites = row.get('Prerequisites', '')  # Get the "Prerequisites" column
            print(prerequisites)
            prerequisites_map[section_title] = prerequisites

    # Read the target CSV, add the "Prerequisites" column, and write to the output file
    with open(target_file, mode='r', newline='', encoding='utf-8') as target, \
         open(output_file, mode='w', newline='', encoding='utf-8') as output:
        
        reader = csv.DictReader(target)
        fieldnames = reader.fieldnames + ['Prerequisites']  #

if __name__ == "__main__":
    input_csv = 'data/course_data/filtered_classes.csv'  # Replace with your input CSV file path
    output_csv = 'data/course_data/merged_classes.csv'  # Replace with your desired output CSV file path
    old_data_csv = "data/course_data/old_data/filtered_courses/filtered_courses.csv"
    process_section_listings(input_csv, output_csv)
    process_course_titles(old_data_csv,'data/course_data/old_data/filtered_courses/filtered_courses2.csv')
    add_prequisites_column('data/course_data/old_data/filtered_courses/filtered_courses2.csv', input_csv, output_csv)


    print(f"Processed CSV saved to {old_data_csv, input_csv, output_csv}")

