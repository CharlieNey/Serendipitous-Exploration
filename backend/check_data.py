import pandas as pd

# Load the CSV file.
file_path = 'filtered_courses.csv'  # Update the path if necessary.
data_frame = pd.read_csv(file_path)

# Check for duplicates in the "Description" column.
duplicates = data_frame[data_frame.duplicated(subset="Description", keep=False)]

if not duplicates.empty:
    print("Duplicate entries found:")
    print(duplicates)
else:
    print("No duplicate entries found.")


# Check for mismatch between "Title" and "Description" column lengths.
titles = data_frame["Course Number"].dropna()
descriptions = data_frame["Description"].dropna()

title_count = len(titles)
description_count = len(descriptions)

if title_count != description_count:
    print(f"Mismatch found: {title_count} titles and {description_count} descriptions.")
    # Find rows with missing titles or descriptions.
    missing_titles = data_frame[data_frame["Course Number"].isna()]
    missing_descriptions = data_frame[data_frame["Description"].isna()]

    if not missing_titles.empty:
        print("Rows with missing titles:")
        print(missing_titles)
    else:
        print("No rows with missing titles.")

    if not missing_descriptions.empty:
        print("Rows with missing descriptions:")
        print(missing_descriptions)
    else:
        print("No rows with missing descriptions.")
else:
    print("The number of titles matches the number of descriptions.")
