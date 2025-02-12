import csv

def filter_courses(input_file, output_file):
    good_sections = ["-00", "-01"]
    # Open the input CSV file for reading
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        
        # Open the output CSV file for writing
        with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
            
            # Write the header to the output file
            writer.writeheader()
            
            # Iterate through each row in the input CSV
            for row in reader:
                # Check if "OCS" is not in the "Notes" column and "Descriptions" column is not empty
                if "OCS" not in row['Notes'] and row['Description'].strip():
                    for num in good_sections:
                        if num  in row["Section Listings"]:
                    # Write the row to the output CSV
                            writer.writerow(row)

# Specify the input and output file paths
input_csv = 'data/course_data/classes.csv'
output_csv = 'data/course_data/filtered_classes.csv'

filter_courses(input_csv, output_csv)

print(f"Filtered courses have been saved to {output_csv}")