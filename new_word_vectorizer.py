import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from gensim.models import KeyedVectors

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

import gensim.downloader as api

glove_model = api.load("glove-wiki-gigaword-50")
# Load the course descriptions and titles from the CSV file
file_path = "filtered_courses.csv"  # Make sure this file exists in the same directory
courses_df = pd.read_csv(file_path)
course_descriptions = courses_df['Description'].dropna().tolist()  # Remove any NaN entries
course_titles = courses_df['Course Number'].dropna().tolist()

# Preprocess text by tokenizing and removing stopwords
stop_words = set(stopwords.words("english"))

def preprocess(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    return tokens

# Create a vector for a piece of text by averaging the vectors of the words
def text_to_vector(text, model):
    tokens = preprocess(text)
    word_vectors = [model[word] for word in tokens if word in model]
    if word_vectors:
        return np.mean(word_vectors, axis=0)
    else:
        return np.zeros(model.vector_size)

# Create vectors for all course descriptions
print("Vectorizing course descriptions...")
vectors = [text_to_vector(desc, glove_model) for desc in course_descriptions]

# Calculate cosine similarity
print("Calculating cosine similarity...")
cosine_sim = cosine_similarity(vectors)

# Function to find most similar courses for each course
def find_most_similar_courses(sim_matrix, titles, descriptions, top_n=3):
    for idx, desc in enumerate(descriptions):
        # Get similarity scores for each course
        sim_scores = list(enumerate(sim_matrix[idx]))
        # Sort courses by similarity, excluding itself
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
        # Display the most similar courses by title
        print(f"\nMost similar courses to '{titles[idx]}':")
        for i, score in sim_scores:
            print(f"  - {titles[i]} (similarity: {score:.3f})")

# Find the top 3 most similar courses for each course
find_most_similar_courses(cosine_sim, course_titles, course_descriptions)

# Find the top 10 most similar pairs of courses
def find_top_similar_pairs(sim_matrix, titles, max_pairs=10):
    pairs = []
    for i in range(len(sim_matrix)):
        for j in range(i + 1, len(sim_matrix)):  # Avoid duplicate pairs and self-comparisons
            similarity = sim_matrix[i][j]
            if similarity < 1:  # Exclude perfect matches
                pairs.append((titles[i], titles[j], similarity))
    # Sort pairs by similarity score in descending order
    pairs = sorted(pairs, key=lambda x: x[2], reverse=True)
    # Get the top `max_pairs` pairs
    print(f"\nTop {max_pairs} most similar course pairs (excluding perfect matches):")
    for title1, title2, score in pairs[:max_pairs]:
        print(f"  - {title1} <--> {title2} (similarity: {score:.2f})")

# Find and print the top 10 most similar course pairs
find_top_similar_pairs(cosine_sim, course_titles, max_pairs=10)