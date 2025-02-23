import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Ensure stopwords are downloaded
nltk.download('stopwords')
nltk.download('punkt')

# Load NLTK stop words
nltk_stop_words = set(stopwords.words('english'))

# Load custom stop words from a CSV file
custom_stop_words_path = 'data/course_data/common_words.csv'  # Update path as needed
custom_stop_words_df = pd.read_csv(custom_stop_words_path)
custom_stop_words = set(custom_stop_words_df['Word'].dropna().str.lower())

# Combine all stop words
all_stop_words = nltk_stop_words.union(custom_stop_words)

# Load course data
file_path = 'data/course_data/filtered_classes.csv'
data_frame = pd.read_csv(file_path).dropna(subset=["Description"])
data = data_frame["Description"].tolist()
course_titles = data_frame["Section Listings"].tolist()

print(course_titles)

tagged_data = [TaggedDocument(words=word_tokenize(doc.lower()), tags=[str(i)]) for i, doc in enumerate(data)]

model = Doc2Vec(vector_size=50, min_count=2, epochs=40, dm = 1)
model.build_vocab(tagged_data)
model.train(tagged_data, total_examples=model.corpus_count, epochs=model.epochs)

# saving the model
os.makedirs("models", exist_ok=True)
model.save("current_models/saved_models/doc2vec.model")

# save the similarity model
document_vectors = [model.dv[i] for i in range(len(tagged_data))]
similarity_matrix = cosine_similarity(document_vectors)

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

similarity_df = pd.DataFrame(similarity_scores)
sorted_similarity_df = similarity_df.sort_values(by=["Course_1", "Similarity"], ascending=[True, False])
top_10_similarity_df = sorted_similarity_df.groupby("Course_1").head(10)

sorted_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_sorted.csv', index=False)
top_10_similarity_df.to_csv('data/doc2vec_output/doc2vec_output_top_10.csv', index=False)

print("Model trained and saved successfully!")
