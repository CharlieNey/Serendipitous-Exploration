# import pandas as pd
# from gensim.models.doc2vec import Doc2Vec, TaggedDocument
# from nltk.tokenize import word_tokenize
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import ConfusionMatrixDisplay, classification_report
# from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.model_selection import train_test_split


# file_path = 'data/filtered_courses.csv'  
# data_frame = pd.read_csv(file_path)

# # extract the "Description" column.
# data = data_frame["Description"].dropna().tolist()  # Drop NaN values and convert to a list.
# course_titles = data_frame['Course Number'].dropna().tolist()

# # this function needs further research

# # preprocess the documents and create TaggedDocuments.
# tagged_data = [TaggedDocument(words=word_tokenize(doc.lower()),
#                               tags=[str(i)]) for i, doc in enumerate(data)]

# # train the Doc2Vec model.
# model = Doc2Vec(vector_size=50, min_count=2, epochs=40)
# model.build_vocab(tagged_data)
# model.train(tagged_data, total_examples=model.corpus_count, epochs=model.epochs)

# # get the document vectors.
# document_vectors = [model.infer_vector(word_tokenize(doc.lower())) for doc in data]

# # compute cosine similarity for each pair of documents.
# similarity_matrix = cosine_similarity(document_vectors)

# # write the similarity scores to a list.
# similarity_scores = []
# for i, doc in enumerate(data):
#     for j, score in enumerate(similarity_matrix[i]):
#         if i != j:
#             similarity_scores.append({
#                 "Course_1": course_titles[i],
#                 "Course_2": course_titles[j],
#                 "Description_1": data[i],
#                 "Description_2": data[j],
#                 "Similarity": score
#             })

# # convert to DataFrame.
# similarity_df = pd.DataFrame(similarity_scores)

# # sort by Course_1 and Similarity in descending order.
# sorted_similarity_df = similarity_df.sort_values(by=["Course_1", "Similarity"], ascending=[True, False])

# # keep only the top 10 most similar courses for each Course_1.
# top_10_similarity_df = sorted_similarity_df.groupby("Course_1").head(10)

# # save to CSV.
# sorted_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_sorted.csv', index=False)

# top_10_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_top_10.csv', index=False)

# print("Similarity scores have been written doc2vec_output_sorted'.")



import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import accuracy_score, roc_auc_score, precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns

# Load your course data
file_path = 'data/filtered_courses.csv'
data_frame = pd.read_csv(file_path)

# Extract the "Description" column
data = data_frame["Description"].dropna().tolist()  # Drop NaN values and convert to a list
course_titles = data_frame['Course Number'].dropna().tolist()

# Preprocess the documents and create TaggedDocuments
tagged_data = [TaggedDocument(words=word_tokenize(doc.lower()), tags=[str(i)]) for i, doc in enumerate(data)]

# Train the Doc2Vec model
model = Doc2Vec(vector_size=50, min_count=2, epochs=40)
model.build_vocab(tagged_data)
model.train(tagged_data, total_examples=model.corpus_count, epochs=model.epochs)

# Get the document vectors
document_vectors = [model.infer_vector(word_tokenize(doc.lower())) for doc in data]

# Compute cosine similarity for each pair of documents
similarity_matrix = cosine_similarity(document_vectors)

# Write the similarity scores to a list
similarity_scores = []
for i, doc in enumerate(data):
    for j, score in enumerate(similarity_matrix[i]):
        if i != j:
            similarity_scores.append({
                "Course_1": course_titles[i],
                "Course_2": course_titles[j],
                "Description_1": data[i],
                "Description_2": data[j],
                "Similarity": score
            })

# Convert to DataFrame
similarity_df = pd.DataFrame(similarity_scores)

# Sort by Course_1 and Similarity in descending order
sorted_similarity_df = similarity_df.sort_values(by=["Course_1", "Similarity"], ascending=[True, False])

# Keep only the top 10 most similar courses for each Course_1
top_10_similarity_df = sorted_similarity_df.groupby("Course_1").head(10)

# Save to CSV
sorted_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_sorted.csv', index=False)
top_10_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_top_10.csv', index=False)

print("Similarity scores have been written to 'doc2vec_output_sorted.csv' and 'doc2vec_output_top_10.csv'.")

# Load the human-categorized data for evaluation
human_categorized_df = pd.read_csv("human_categorized.csv")  # Ensure columns are: desc1, desc2, label

# Function to get embeddings for a course description
def get_embedding(text):
    return model.infer_vector(word_tokenize(text.lower()))

# Generate embeddings and compute similarity for human-categorized pairs
similarity_scores_eval = []
labels_eval = []
for index, row in human_categorized_df.iterrows():
    desc1 = row['desc1']
    desc2 = row['desc2']
    label = row['label']
    
    # Get embeddings
    emb1 = get_embedding(desc1)
    emb2 = get_embedding(desc2)
    
    # Calculate cosine similarity
    similarity = cosine_similarity([emb1], [emb2])[0][0]
    
    # Store results
    similarity_scores_eval.append(similarity)
    labels_eval.append(label)

# Evaluate the model
# Threshold similarity scores to get binary predictions
predictions = [1 if score > 0.5 else 0 for score in similarity_scores_eval]

# Calculate metrics
accuracy = accuracy_score(labels_eval, predictions)
roc_auc = roc_auc_score(labels_eval, similarity_scores_eval)
precision, recall, f1, _ = precision_recall_fscore_support(labels_eval, predictions, average='binary')

print("\nEvaluation Metrics:")
print(f"Accuracy: {accuracy}")
print(f"ROC-AUC: {roc_auc}")
print(f"Precision: {precision}, Recall: {recall}, F1-Score: {f1}")

# Optional: Visualize similarity scores
plt.figure(figsize=(8, 6))
sns.histplot([score for score, label in zip(similarity_scores_eval, labels_eval) if label == 1], color='blue', label='Similar', kde=True)
sns.histplot([score for score, label in zip(similarity_scores_eval, labels_eval) if label == 0], color='red', label='Not Similar', kde=True)
plt.legend()
plt.xlabel('Cosine Similarity')
plt.ylabel('Frequency')
plt.title('Distribution of Similarity Scores (Human-Categorized Data)')
plt.show()