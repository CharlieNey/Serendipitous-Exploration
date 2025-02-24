import os
import pandas as pd
import numpy as np
import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords

#outdated now

# Load Word2Vec model

wv = api.load('word2vec-google-news-300')

# Download NLTK stopwords if not already available
nltk.download('stopwords')

# File paths
input_file = "../data/graph_data/graph_connections.csv"
output_file = "../data/graph_data/current_graph_data.csv"

# Load input data
df = pd.read_csv(input_file)

# Load custom stop words from CSV
common_word_data = "../data/course_data/stop_words_handpicked.csv"
stopwords_df = pd.read_csv(common_word_data)
custom_stopwords = set(stopwords_df["Word"].dropna().str.lower().tolist())

# Combine NLTK and custom stop words
stop_words = set(stopwords.words("english")).union(custom_stopwords)

# Function to find the most similar words between two descriptions
def find_most_similar_word(desc1, desc2):
    if pd.isna(desc1) or pd.isna(desc2) or desc1.strip() == "" or desc2.strip() == "":
        return ""

    # Tokenize and remove stopwords
    words1 = [word.lower() for word in desc1.split() if word.lower() not in stop_words and word in wv.key_to_index]
    words2 = [word.lower() for word in desc2.split() if word.lower() not in stop_words and word in wv.key_to_index]

    if not words1 or not words2:
        return ""

    # Encode words using Word2Vec (Only keep words that exist in the vocabulary)
    embeddings1 = np.array([wv[word] for word in words1 if word in wv.key_to_index])
    embeddings2 = np.array([wv[word] for word in words2 if word in wv.key_to_index])

    if embeddings1.size == 0 or embeddings2.size == 0:
        return ""

    # Compute cosine similarity matrix
    similarity_matrix = cosine_similarity(embeddings1, embeddings2)

    # Find most similar word pair
    word1_idx, word2_idx = np.unravel_index(similarity_matrix.argmax(), similarity_matrix.shape)

    return (wv.most_similar(positive=[word2_idx, word1_idx], topn=1))

# Apply function to each row
df["most_similar_word"] = df.apply(lambda row: find_most_similar_word(row["desc1"], row["desc2"]), axis=1)

# Save to a new CSV file
df.to_csv(output_file, index=False)

# word + course title from source node which connects to target node

print(f"Processed data saved to {output_file}")
