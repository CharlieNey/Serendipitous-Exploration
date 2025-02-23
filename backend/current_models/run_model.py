import pandas as pd
from gensim.models.doc2vec import Doc2Vec
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import os

def load_model(model_path):

    return Doc2Vec.load(model_path)

def calculate_similarity(model, course_file_path, output_dir):

    # Load course data
    course_data_frame = pd.read_csv(course_file_path).dropna(subset=["Description"])
    course_data = course_data_frame["Description"].tolist()
    course_titles = course_data_frame["Section Listings"].tolist()

    # Vectorize the course descriptions using the trained model
    course_vectors = [model.infer_vector(word_tokenize(doc.lower())) for doc in course_data]

    # Calculate cosine similarity between course vectors
    similarity_matrix = cosine_similarity(course_vectors)

    # Generate similarity scores
    similarity_scores = []
    for i, doc in enumerate(course_data):
        for j, score in enumerate(similarity_matrix[i]):
            if i != j:
                similarity_scores.append({
                    "Course_1": course_titles[i],
                    "Course_2": course_titles[j],
                    "Description_1": course_data[i],
                    "Description_2": course_data[j],
                    "Similarity": score
                })

    # Create DataFrame and sort by similarity
    similarity_df = pd.DataFrame(similarity_scores)
    sorted_similarity_df = similarity_df.sort_values(by=["Course_1", "Similarity"], ascending=[True, False])
    top_10_similarity_df = sorted_similarity_df.groupby("Course_1").head(10)

    # Save the results to CSV files
    os.makedirs(output_dir, exist_ok=True)
    sorted_similarity_df.to_csv(f"{output_dir}/doc2vec_output_sorted.csv", index=False)
    top_10_similarity_df.to_csv(f"{output_dir}/doc2vec_output_top_10.csv", index=False)
    print(f"Similarity results saved to {output_dir}")

if __name__ == "__main__":
    # Paths
    model_path = "current_models/saved_models/trained_doc2vec.model"
    course_file_path = "data/course_data/filtered_classes.csv"
    output_dir = "data/doc2vec_output"

    # Load the trained model
    model = load_model(model_path)

    # Calculate similarity and save results
    calculate_similarity(model, course_file_path, output_dir)