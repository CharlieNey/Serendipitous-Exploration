"""
Author: Charlie Ney
Description: This script evaluates a trained Doc2Vec model by computing similarity scores between course descriptions. 
It loads a our Doc2Vec model and a dataset of categorized course pairs.  
Each course description is converted into an embedding, and cosine similarity is calculated between pairs.  
Based on a similarity threshold of 0.90, predictions are made and evaluated against human labels.  
"""

import pandas as pd
from gensim.models.doc2vec import Doc2Vec
from nltk.tokenize import word_tokenize
from sklearn.metrics import accuracy_score
from sklearn.metrics.pairwise import cosine_similarity

# load trained model
model = Doc2Vec.load("current_models/saved_models/trained_doc2vec.model")

human_categorized_df1 = pd.read_csv("data/metadata_output/random_sample_categorized.csv")
human_categorized_df2 = pd.read_csv("data/metadata_output/random_sample_categorized_top_10.csv")

human_categorized_df = pd.concat([human_categorized_df1, human_categorized_df2], ignore_index=True)


def get_embedding(text):
    return model.infer_vector(word_tokenize(text.lower()))

# compute similarity scores
similarity_scores_eval = []
labels_eval = []
for index, row in human_categorized_df.iterrows():
    desc1, desc2, label = row['Description_1'], row['Description_2'], row['Tiebreak']
    
    emb1, emb2 = get_embedding(desc1), get_embedding(desc2)

    similarity = cosine_similarity([emb1], [emb2])[0][0]

    similarity_scores_eval.append(similarity)
    labels_eval.append(label)

# compute predictions
predictions = [1 if score > 0.90 else 0 for score in similarity_scores_eval]

accuracy = accuracy_score(labels_eval, predictions)

print("\nEvaluation Metrics:")
print(f"Accuracy: {accuracy:.4f}")

