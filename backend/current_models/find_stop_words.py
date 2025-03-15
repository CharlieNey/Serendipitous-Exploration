''' 
Author: Markus Gunadi
Description: Finds potential stopwords in course description. Requires a manual check afterwards to remove keywords
that should not be included in stopwords and add words that are less than the min_count but are still noise.
e.g. words in descriptions talking about requirements may be missed by the count but should be included.
After check, save new csv file to ../data/course_data/stop_words_handpicked.csv
'''
import pandas as pd
import re
from collections import Counter

# Function to get words that appear more than 1- times in dataset
def save_common_words_to_csv(csv_file, column_name, output_file, min_count=10):
    df = pd.read_csv(csv_file)
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' not found in the CSV file.")
    text = " ".join(df[column_name].astype(str)).lower()
    words = re.findall(r'\b\w+\b', text)
    word_counts = Counter(words)
    common_words = {word: count for word, count in word_counts.items() if count > min_count}
    common_words_df = pd.DataFrame(list(common_words.items()), columns=["Word", "Count"])
    common_words_df = common_words_df.sort_values(by="Count", ascending=False)
    common_words_df.to_csv(output_file, index=False)
    print(f"Saved {len(common_words)} common words to {output_file}")

csv_file = "../data/course_data/filtered_classes.csv"
column_name = "Description" 
output_file = "../data/course_data/common_words.csv" 

save_common_words_to_csv(csv_file, column_name, output_file)
