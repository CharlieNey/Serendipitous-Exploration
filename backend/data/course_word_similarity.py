import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

custom_stop_words = {"course", "courses", "study", "studies", "students", "ways"}
stop_words = stop_words.union(custom_stop_words)

def vectorize_and_find_similar_words(desc1, desc2):
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # fit the vectorizer on both descriptions
    tfidf_matrix = vectorizer.fit_transform([desc1, desc2])

    # convert to dense array and compute cosine similarity between terms
    feature_names = vectorizer.get_feature_names_out()
    tfidf_array = tfidf_matrix.toarray()

    scores1 = tfidf_array[0, :]
    scores2 = tfidf_array[1, :]

    # find overlapping words and their scores
    word_scores = []
    for i, word in enumerate(feature_names):
        if word not in stop_words and scores1[i] > 0 and scores2[i] > 0:
            similarity_score = min(scores1[i], scores2[i])
            word_scores.append((word, similarity_score))

    # sort by similarity score in descending order
    word_scores = sorted(word_scores, key=lambda x: x[1], reverse=True)

    # return only the words as a comma-separated string
    return ", ".join([word for word, _ in word_scores])

input_file = 'backend/data/doc2vec_top10_output.csv' 
output_file = 'backend/data/courses_with_similar_words.csv'

df = pd.read_csv(input_file)

if 'Description_1' in df.columns and 'Description_2' in df.columns:
    df['Most_Similar_Words'] = df.apply(
        lambda row: vectorize_and_find_similar_words(row['Description_1'], row['Description_2']),
        axis=1
    )

    # save the updated DataFrame to a new CSV file
    df.to_csv(output_file, index=False)
    print(f"Updated file saved as {output_file}")
else:
    print("The input CSV file must contain 'Description_1' and 'Description_2' columns.")
