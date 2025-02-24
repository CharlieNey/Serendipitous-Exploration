import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
import os

def train_and_save_model(training_file_path, model_save_path):

    # Load training data
    training_data_frame = pd.read_csv(training_file_path).dropna(subset=["Description"])
    training_data = training_data_frame["Description"].tolist()

    # Tokenize and tag the training data for Doc2Vec
    tagged_training_data = [TaggedDocument(words=word_tokenize(doc.lower()), tags=[str(i)]) for i, doc in enumerate(training_data)]

    # Initialize and train the Doc2Vec model
    model = Doc2Vec(vector_size= 50, min_count=2, epochs=40, dm=1)
    model.build_vocab(tagged_training_data)
    model.train(tagged_training_data, total_examples=model.corpus_count, epochs=model.epochs)

    # Save the trained model
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    model.save(model_save_path)
    print(f"Model trained and saved to {model_save_path}")

if __name__ == "__main__":
    # Paths
    training_file_path = "data/training_data/filtered_course-catalog.csv"
    model_save_path = "current_models/saved_models/trained_doc2vec.model"

    # Train and save the model
    train_and_save_model(training_file_path, model_save_path)