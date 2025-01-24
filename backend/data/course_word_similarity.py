import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import nltk

# Ensure stopwords are downloaded
nltk.download('stopwords')

# Load stop words
stop_words = set(stopwords.words('english'))

custom_stop_words = {"course", "courses", "study", "studies", "students", "ways"}
stop_words = stop_words.union(custom_stop_words)

# Function to preprocess and vectorize text
def vectorize_and_find_similar_words(desc1, desc2):
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # Fit the vectorizer on both descriptions
    tfidf_matrix = vectorizer.fit_transform([desc1, desc2])

    # Convert to dense array and compute cosine similarity between terms
    feature_names = vectorizer.get_feature_names_out()
    tfidf_array = tfidf_matrix.toarray()

    # Extract words with non-zero scores for both descriptions
    scores1 = tfidf_array[0, :]
    scores2 = tfidf_array[1, :]

    # Find overlapping words and their scores
    word_scores = []
    for i, word in enumerate(feature_names):
        if word not in stop_words and scores1[i] > 0 and scores2[i] > 0:
            similarity_score = min(scores1[i], scores2[i])
            word_scores.append((word, similarity_score))

    # Sort by similarity score in descending order
    word_scores = sorted(word_scores, key=lambda x: x[1], reverse=True)

    # Return only the words as a comma-separated string
    return ", ".join([word for word, _ in word_scores])

# Load CSV file
input_file = 'backend/data/doc2vec_top10_output.csv'  # Replace with your file path
output_file = 'backend/data/courses_with_similar_words.csv'

# Read the file
df = pd.read_csv(input_file)

# Ensure required columns exist
if 'Description_1' in df.columns and 'Description_2' in df.columns:
    # Calculate similar words for each row
    df['Most_Similar_Words'] = df.apply(
        lambda row: vectorize_and_find_similar_words(row['Description_1'], row['Description_2']),
        axis=1
    )

    # Save the updated DataFrame to a new CSV file
    df.to_csv(output_file, index=False)
    print(f"Updated file saved as {output_file}")
else:
    print("The input CSV file must contain 'Description_1' and 'Description_2' columns.")
