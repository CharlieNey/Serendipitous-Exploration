import nltk
import csv
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from collections import Counter

# download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# load the course descriptions and titles from the CSV file
file_path = "data/courses.csv"  # make sure this file exists in the same directory
courses_df = pd.read_csv(file_path)
courses_df = courses_df.dropna(subset=['Description', 'Course Number'])
courses_df = courses_df.drop_duplicates(subset=['Course Title', 'Course Number'])
def clean_credits(credit):
    if isinstance(credit, float):  # If it's already a float, return as-is
        return credit
    if isinstance(credit, str):  # If it's a string, clean and convert
        try:
            # Extract numeric part of the credit string
            return float(''.join(c for c in credit if c.isdigit() or c == '.'))
        except ValueError:
            return None  # Handle cases where conversion is not possible
    return None  # Return None for other data types

# Apply the cleaning function to the 'Credits' column
courses_df['Credits'] = courses_df['Credits'].apply(clean_credits)

# Drop rows where 'Credits' could not be converted
courses_df = courses_df.dropna(subset=['Credits'])

courses_df = courses_df[~(
    (courses_df['Course Title'].str.contains('MUSC|PE', case=False, na=False)) &
    (courses_df['Credits'].astype(float) < 3)
)]

course_descriptions = courses_df['Description'].dropna().tolist()  # Remove any NaN entries
course_titles = courses_df['Course Number'].dropna().tolist()
course_credits = courses_df['Credits'].dropna().tolist()

#courses_df = courses_df[courses_df['Course Title'] != 'Integrative Exercise']
#courses_df = courses_df[courses_df['Course Number'] != 'OCP 307']

#courses_df = courses_df.query("`Course Title` != 'Integrative Exercise' and `Course Number` != 'OCP 307'")
#print(courses_df[['Course Title', 'Course Number']].tail())
#print(courses_df[['Course Title', 'Course Number']].head())
#print(courses_df.columns)
# Preprocess text by tokenizing and removing stopwords
stop_words = set(stopwords.words("english"))

def preprocess(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    return tokens

# Create a vocabulary from the course descriptions
vocab = set()
processed_courses = []
for desc in course_descriptions:
    tokens = preprocess(desc)
    vocab.update(tokens)
    processed_courses.append(tokens)
vocab = sorted(vocab)

# Create word vectors for each course description
def vectorize(text_tokens, vocab):
    # Count term frequencies
    term_counts = Counter(text_tokens)
    # Create vector based on vocabulary
    return np.array([term_counts[word] for word in vocab])

vectors = [vectorize(tokens, vocab) for tokens in processed_courses]

# Calculate cosine similarity
cosine_sim = cosine_similarity(vectors)

# Function to find most similar courses for each course
def find_most_similar_courses(sim_matrix, titles, descriptions, top_n=3):
    
    # Open a CSV file for writing
    with open(output_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Write the header row
        writer.writerow(['Course Title', 'Course Description', 'Similar Course', 'Similar Course Description', 'Similarity Score'])
        
        for idx, desc in enumerate(descriptions):
            # Get similarity scores for each course
            sim_scores = list(enumerate(sim_matrix[idx]))
            # Sort courses by similarity, excluding itself
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
            
            # Write the most similar courses by title and description to the CSV file
            for i, score in sim_scores:
                writer.writerow([titles[idx], descriptions[idx], titles[i], descriptions[i], f"{score:.2f}"])

#Save the output to 'similar_courses.csv'
output_file = 'data/vectorizer_outputs/vectorizer_output5.csv'

# Find the top 3 most similar courses for each course
find_most_similar_courses(cosine_sim, course_titles, course_descriptions)
#print(len(course_titles))
print(len(course_descriptions))
