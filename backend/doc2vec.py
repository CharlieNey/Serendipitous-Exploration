from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Define a list of documents.
data = ["“If you remember the Sixties, you weren’t there.”  We will test the truth of that popular adage by exploring the American youth counterculture of the 1960s, particularly the turbulent period of the late sixties. Using examples from literature, music, and film, we will examine the hope and idealism, the violence, confusion, wacky creativity, and social mores of this seminal decade in American culture. Topics explored will include the Beat Generation, the Vietnam War, Civil Rights, LSD, and the rise of environmentalism, feminism, and Black Power.Extra time",
        "The Middle East is home to a great number of musical styles, genres, and traditions. Regional, ideological, and cultural diversity, national identity, and cross-cultural encounters–all express themselves in music. We will explore some of the many musical traditions in the Arab world, from early twentieth century to the present. Class discussions based on readings in English and guided listening. No prior music knowledge required, but interested students with or without musical background can participate in an optional, hands-on Arab music performance workshop, on Western or a few (provided) Middle Eastern instruments throughout the term.",
        "This course focuses on lost wax casting, 3D modeling and printing, and stone setting as methods to create jewelry and small sculptural objects in bronze and silver. Specific instruction will be given in the proper use of tools, torches, and other equipment, wax carving, and general metalsmithing techniques. Through the use of 3D modeling software and 3D printing, new technologies will expedite traditional processes allowing for a broad range of metalworking possibilities.Two seats held for Art and Art History majors until the day after junior priority registration.",
        "A study of galactic and extragalactic astronomy with an emphasis on the physical principles underlying the observed phenomena. Topics include the structure and dynamics of the Milky Way Galaxy and other galaxies, the interstellar medium, quasars and active galaxies, clusters and superclusters, and cosmology."]

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

# For each document, find the top 3 most similar documents.
for i, doc in enumerate(data):
    similarities = similarity_matrix[i]
    # Get the indices of the top 3 most similar documents (excluding the document itself).
    similar_indices = np.argsort(similarities)[::-1][1:4]  # Sort in descending order and exclude self.
    print(f"Document {i+1}: {doc}")
    print("Top 3 similar documents:")
    for rank, idx in enumerate(similar_indices, 1):
        print(f"{rank}. Document {idx+1} (Similarity: {similarities[idx]:.4f}) - {data[idx]}")
    print()
