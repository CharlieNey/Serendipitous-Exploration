# Code source: https://www.analyticsvidhya.com/blog/2016/08/beginners-guide-to-topic-modeling-in-python/
# Tutorial: https://www.datacamp.com/tutorial/what-is-topic-modeling
# BERTOPIC SOURCE: https://maartengr.github.io/BERTopic/index.html#quick-start
# Author/Comments: Markus Gunadi

import string
import nltk
import pandas as pd
file_path = "backend/filtered_courses.csv"
courses_df = pd.read_csv(file_path)
course_descriptions = courses_df['Description'].dropna().tolist()  # Remove any NaN entries
print(course_descriptions)
course_titles = courses_df['Course Number'].dropna().tolist()

nltk.download('stopwords')
nltk.download('wordnet')  
nltk.download('omw-1.4')  
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer

from gensim import corpora
from gensim.models import LsiModel
from gensim.models import LdaModel
import pyLDAvis
import pyLDAvis.gensim_models as gensimvis  # Import for Gensim version
import matplotlib.pyplot as plt

# remove stopwords, punctuation, and normalize the corpus
stop = set(stopwords.words('english'))
exclude = set(string.punctuation)
lemma = WordNetLemmatizer()

def clean(course_description):
    stop_free = " ".join([i for i in course_description.lower().split() if i not in stop])
    punc_free = "".join(ch for ch in stop_free if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())
    return normalized

clean_corpus = [clean(description).split() for description in course_descriptions]
#print(clean_corpus)

# Creating document-term matrix 
dictionary = corpora.Dictionary(clean_corpus)
#doc_term_matrix = [dictionary.doc2bow(course_descriptions) for course_titles in clean_corpus]
doc_term_matrix = [dictionary.doc2bow(text) for text in clean_corpus]

# LSA model
#lsa = LsiModel(doc_term_matrix, num_topics=3, id2word = dictionary)

# LSA model
#print(lsa.print_topics(num_topics=3, num_words=3))

# LDA model
lda = LdaModel(doc_term_matrix, num_topics=8, id2word = dictionary)

# Results
print(lda.print_topics(num_topics=5, num_words=10))

# Visualize the topics
lda_vis = gensimvis.prepare(lda, doc_term_matrix, dictionary)

# For saving the visualization to an HTML file
pyLDAvis.save_html(lda_vis, 'lda_visualization.html')



# BERTOPIC MODEL


from bertopic import BERTopic
docs = course_descriptions


from bertopic.representation import KeyBERTInspired

from umap import UMAP
from hdbscan import HDBSCAN
representation_model = KeyBERTInspired()

umap_model = UMAP(n_neighbors=15, n_components=5, min_dist=0.0, metric='cosine')
hdbscan_model = HDBSCAN(min_cluster_size=10, metric='euclidean', cluster_selection_method='eom')
topic_model = BERTopic(umap_model=umap_model, hdbscan_model=hdbscan_model, representation_model=representation_model)

topics, probs = topic_model.fit_transform(docs)
print(topic_model.get_topic_info(2))
# Fine-tune your topic representations
#topic_model = BERTopic(representation_model=representation_model)

#topics, probs = topic_model.fit_transform(docs)
#print(topic_model.get_topic_info(0))
#print(topic_model.get_topic_info())

#show_topics(num_topics=4, num_words=10, log=False, formatted=True)
"""
[
(0, '0.555*"water" + 0.489*"percent" + 0.239*"planet"'), 
(1, '0.361*"sleeping" + 0.215*"hour" + 0.215*"still"'), 
(2, '-0.562*"water" + 0.231*"rain" + 0.231*"planet"')
]
"""