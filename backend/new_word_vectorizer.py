import nltk 
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from gensim.models import KeyedVectors
import gensim.downloader as api

nltk.download('stopwords')

glove_model = api.load("glove-wiki-gigaword-50")
word2vec_model = api.load("word2vec-google-news-300")

# Load the course descriptions and titles from the CSV file
file_path = "data/filtered_courses.csv" 
courses_df = pd.read_csv(file_path)

#Check indexing
course_descriptions = courses_df['Description'].dropna().tolist() 
 
course_titles = courses_df['Course Number'].dropna().tolist()


stop_words = set(stopwords.words("english"))

def preprocess(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    return tokens

# Create a vector for each description
def text_to_vector(text, model):
    tokens = preprocess(text)
    word_vectors = [model[word] for word in tokens if word in model]
    if word_vectors:
        return np.mean(word_vectors, axis=0)
    # If there is no words that are recognized
    else:
        return np.zeros(model.vector_size)

# Vectorize course descriptions for both models
print("Vectorizing course descriptions...")
glove_vectors = [text_to_vector(desc, glove_model) for desc in course_descriptions]
word2vec_vectors = [text_to_vector(desc, word2vec_model) for desc in course_descriptions]

# Calculate cosine similarity matrices for both models
print("Calculating cosine similarity...")

glove_cosine_sim = cosine_similarity(glove_vectors)
word2vec_cosine_sim = cosine_similarity(word2vec_vectors)

# Function to find most similar courses for each course
def find_most_similar_courses(sim_matrix, titles, descriptions, model_name, top_n=3):
    print(f"\nFinding most similar courses using {model_name}...")
    for idx, desc in enumerate(descriptions):
        # Get similarity scores for each course
        sim_scores = list(enumerate(sim_matrix[idx]))
        # Sort courses by similarity
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

        print(f"\nMost similar courses to '{titles[idx]}' using {model_name}:")
        for i, score in sim_scores:
            print(f"  - {titles[i]} (similarity: {score:.3f})")

# Compare the similarity matrices between the models
def compare_similarity_matrices(glove_sim, word2vec_sim):
    differences = []
    for i in range(len(glove_sim)):
        for j in range(len(glove_sim[i])):

            # Using Apsolute Value...
            differences.append(abs(glove_sim[i][j] - word2vec_sim[i][j]))
    avg_difference = np.mean(differences)
    print(f"\nAverage difference in similarity scores: {avg_difference:.4f}")

# Find most similar courses and compare top pairs for each model
find_most_similar_courses(glove_cosine_sim, course_titles, course_descriptions, "GloVe")
find_most_similar_courses(word2vec_cosine_sim, course_titles, course_descriptions, "Word2Vec")

# Compare similarity matrices
compare_similarity_matrices(glove_cosine_sim, word2vec_cosine_sim)

# Function to find the top N most similar course pairs
def find_top_similar_pairs(sim_matrix, titles, model_name, max_pairs=10):
    pairs = []
    for i in range(len(sim_matrix)):
        for j in range(i + 1, len(sim_matrix)):  # Avoid duplicate pairs and self-comparisons
            similarity = sim_matrix[i][j]
            if similarity < 1:  # Exclude perfect matches
                pairs.append((titles[i], titles[j], similarity))
    # Sort pairs by similarity score in descending order
    pairs = sorted(pairs, key=lambda x: x[2], reverse=True)
    
    
    # Get the top ~10 pairs
    print(f"\nTop {max_pairs} most similar course pairs using {model_name}:")
    for title1, title2, score in pairs[:max_pairs]:
        print(f"  {title1} <--> {title2} (similarity: {score:.4f})")

# Print top similar pairs for each model
find_top_similar_pairs(glove_cosine_sim, course_titles, "GloVe")
find_top_similar_pairs(word2vec_cosine_sim, course_titles, "Word2Vec")


print("descriptions len: ", len(course_descriptions))
print("titles len: ", len(course_titles))

