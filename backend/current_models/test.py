import spacy
import networkx as nx
from gensim.models import KeyedVectors
from itertools import product

# Load pre-trained Word2Vec model (Change path accordingly)
word_vectors = KeyedVectors.load_word2vec_format("path/to/word2vec.bin", binary=True)

# Load Spacy model for tokenization and lemmatization
nlp = spacy.load("en_core_web_sm")

# Sample paragraphs
paragraph1 = "Artificial intelligence is transforming technology."
paragraph2 = "Machine learning is a subset of AI that improves models."

# Preprocess text
def preprocess(text):
    doc = nlp(text.lower())
    return [token.lemma_ for token in doc if token.is_alpha and token.lemma_ in word_vectors]

words1 = preprocess(paragraph1)
words2 = preprocess(paragraph2)

# Create similarity graph
G = nx.Graph()

for w1, w2 in product(words1, words2):
    if w1 in word_vectors and w2 in word_vectors:
        similarity = word_vectors.similarity(w1, w2)
        if similarity > 0.5:  # Add only meaningful edges
            G.add_edge(w1, w2, weight=similarity)

# Compute betweenness centrality
centrality = nx.betweenness_centrality(G, weight="weight")

# Find the most central word
most_central_word = max(centrality, key=centrality.get, default=None)
print(f"Most central connecting word: {most_central_word}")