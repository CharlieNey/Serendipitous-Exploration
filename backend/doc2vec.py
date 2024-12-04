import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load the CSV file.
file_path = 'filtered_courses.csv'  # Update the path if necessary.
data_frame = pd.read_csv(file_path)

# Extract the "Description" column.
data = data_frame["Description"].dropna().tolist()  # Drop NaN values and convert to a list.
course_titles = data_frame['Course Number'].dropna().tolist()

print(len(data))
print(len(course_titles))

# Preprocess the documents and create TaggedDocuments.
tagged_data = [TaggedDocument(words=word_tokenize(doc.lower()),
                              tags=[str(i)]) for i, doc in enumerate(data)]

# Train the Doc2Vec model.
model = Doc2Vec(vector_size=20, min_count=2, epochs=50)
model.build_vocab(tagged_data)
model.train(tagged_data, total_examples=model.corpus_count, epochs=model.epochs)

# Get the document vectors.
document_vectors = [model.infer_vector(word_tokenize(doc.lower())) for doc in data]

# Compute cosine similarity for each pair of documents.
similarity_matrix = cosine_similarity(document_vectors)

# Write the similarity scores to a CSV file.
similarity_scores = []
for i, doc in enumerate(data):
    for j, score in enumerate(similarity_matrix[i]):
        similarity_scores.append({
            "Course_1": course_titles[i],
            "Course_2": course_titles[j],
            "Similarity": score
        })

# Convert to DataFrame and save to CSV.
similarity_df = pd.DataFrame(similarity_scores)
similarity_df.to_csv('course_similarity_scores.csv', index=False)

print("Similarity scores have been written to 'course_similarity_scores.csv'.")
