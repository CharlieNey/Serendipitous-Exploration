import pandas as pd
import numpy as np
import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords

# download NLTK stopwords if not already available
nltk.download('stopwords')

# load a pretrained Word2Vec model from Gensim
word2vec = api.load("glove-wiki-gigaword-100")  # 100D GloVe embeddings

common_word_data = "../data/metadata_output/stop_words_handpicked.csv"
input_file = "../data/graph_data/charlie_graph.csv"
output_file = "../data/graph_data/current_graph_data.csv"

df = pd.read_csv(input_file)

# load the generated common words CSV
stopwords_df = pd.read_csv(common_word_data)

# convert words to a Python list
custom_stopwords = stopwords_df["Word"].tolist()

stop_words = set(stopwords.words("english")).union(custom_stopwords)

def find_most_similar_word(desc1, desc2):
    if pd.isna(desc1) or pd.isna(desc2) or desc1.strip() == "" or desc2.strip() == "":
        return ""

    # Tokenize and remove stopwords
    words1 = [word.lower() for word in desc1.split() if word.lower() not in stop_words and word in word2vec]
    words2 = [word.lower() for word in desc2.split() if word.lower() not in stop_words and word in word2vec]

    if not words1 or not words2:
        return ""

    # Encode words using Word2Vec
    embeddings1 = np.array([word2vec[word] for word in words1])
    embeddings2 = np.array([word2vec[word] for word in words2])

    # Compute cosine similarity matrix
    similarity_matrix = cosine_similarity(embeddings1, embeddings2)

    # Find most similar word pair
    word1_idx, word2_idx = np.unravel_index(similarity_matrix.argmax(), similarity_matrix.shape)

    # Compute the vector difference
    difference_vector = embeddings1[word1_idx] - embeddings2[word2_idx]

    # Find the closest word to the difference vector
    closest_word = min(word2vec.index_to_key, key=lambda word: np.linalg.norm(word2vec[word] - difference_vector))

    return closest_word

# Apply function to each row
df["most_similar_word"] = df.apply(lambda row: find_most_similar_word(row["desc1"], row["desc2"]), axis=1)

# Save to a new CSV file
df.to_csv(output_file, index=False)

print(f"Processed data saved to {output_file}")
