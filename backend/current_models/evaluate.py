

import pandas as pd
from gensim.models.doc2vec import Doc2Vec
from nltk.tokenize import word_tokenize
from sklearn.metrics import accuracy_score
from sklearn.metrics.pairwise import cosine_similarity

# load trained model
model = Doc2Vec.load("current_models/saved_models/doc2vec.model")

# load human-categorized data
# Load the two CSV files
human_categorized_df1 = pd.read_csv("data/metadata_output/random_sample_categorized.csv")
human_categorized_df2 = pd.read_csv("data/metadata_output/random_sample_categorized_top_10.csv")

# Combine the two DataFrames vertically (row-wise)
human_categorized_df = pd.concat([human_categorized_df1, human_categorized_df2], ignore_index=True)


# Function to infer vector for new text
def get_embedding(text):
    return model.infer_vector(word_tokenize(text.lower()))

# compute similarity scores
similarity_scores_eval = []
labels_eval = []
for index, row in human_categorized_df.iterrows():
    desc1, desc2, label = row['Description_1'], row['Description_2'], row['Tiebreak']
    
    # Gets both embeddings then calculates similarity
    emb1, emb2 = get_embedding(desc1), get_embedding(desc2)

    # Since teh matrix only creates a single value in the 2d array, we have to get that index and set similarity to that
    similarity = cosine_similarity([emb1], [emb2])[0][0]

    similarity_scores_eval.append(similarity)
    labels_eval.append(label)

# compute predictions
predictions = [1 if score > 0.6 else 0 for score in similarity_scores_eval]

# Compute accuracy (could add more here)
accuracy = accuracy_score(labels_eval, predictions)

print("\nEvaluation Metrics:")
print(f"Accuracy: {accuracy:.4f}")

