# Code source: https://www.analyticsvidhya.com/blog/2016/08/beginners-guide-to-topic-modeling-in-python/
# Tutorial: https://www.datacamp.com/tutorial/what-is-topic-modeling
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
lda = LdaModel(doc_term_matrix, num_topics=10, id2word = dictionary)

# Results
print(lda.print_topics(num_topics=5, num_words=10))

#show_topics(num_topics=4, num_words=10, log=False, formatted=True)
"""
[
(0, '0.555*"water" + 0.489*"percent" + 0.239*"planet"'), 
(1, '0.361*"sleeping" + 0.215*"hour" + 0.215*"still"'), 
(2, '-0.562*"water" + 0.231*"rain" + 0.231*"planet"')
]
"""