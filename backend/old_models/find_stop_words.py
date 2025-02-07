import pandas as pd
import re
from collections import Counter

def save_common_words_to_csv(csv_file, column_name, output_file, min_count=20):
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Check if the column exists
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' not found in the CSV file.")

    # Concatenate all descriptions, clean text, and split into words
    text = " ".join(df[column_name].astype(str)).lower()
    words = re.findall(r'\b\w+\b', text)  # Extract words using regex

    # Count word frequencies
    word_counts = Counter(words)

    # Filter words that appear more than min_count times
    common_words = {word: count for word, count in word_counts.items() if count > min_count}

    # Convert to DataFrame
    common_words_df = pd.DataFrame(list(common_words.items()), columns=["Word", "Count"])

    # Save to CSV
    common_words_df.to_csv(output_file, index=False)
    print(f"Saved {len(common_words)} common words to {output_file}")

# Example usage
csv_file = "../data/course_data/filtered_courses/filtered_courses_2.csv"  # Replace with your input CSV file
column_name = "Description"  # Replace with your column name
output_file = "../data/course_data/common_words.csv"  # Replace with your desired output file

save_common_words_to_csv(csv_file, column_name, output_file)
