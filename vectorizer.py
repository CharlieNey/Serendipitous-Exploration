import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from collections import Counter

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Load the course descriptions and titles from the CSV file
file_path = "courses.csv"  # Make sure this file exists in the same directory
courses_df = pd.read_csv(file_path)
course_descriptions = courses_df['Description'].dropna().tolist()  # Remove any NaN entries
course_titles = courses_df['Course Number'].dropna().tolist()

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
    for idx, desc in enumerate(descriptions):
        # Get similarity scores for each course
        sim_scores = list(enumerate(sim_matrix[idx]))
        # Sort courses by similarity, excluding itself
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
        # Display the most similar courses by title
        print(f"\nMost similar courses to '{titles[idx]}':")
        for i, score in sim_scores:
            print(f"  - {titles[i]} (similarity: {score:.2f})")

# Find the top 3 most similar courses for each course
find_most_similar_courses(cosine_sim, course_titles, course_descriptions)
