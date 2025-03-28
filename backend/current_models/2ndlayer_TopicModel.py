''' 
Author: Markus Gunadi
Description: Appends Topic Keywords to each Spring 2025 Course Description using pretrained gensim LDA_topic modeler. 
Code template used from tutorial: https://www.machinelearningplus.com/nlp/topic-modeling-gensim-python/#9createbigramandtrigrammodels
'''
from nltk.corpus import stopwords
import re
import numpy as np
import pandas as pd
from pprint import pprint
from scipy.spatial.distance import cosine

import gensim
import gensim.corpora as corpora
from gensim.utils import simple_preprocess
from gensim.models import CoherenceModel
import spacy

nlp = spacy.load('en_core_web_sm')

# remove stopwords
def remove_stopwords(texts):
    common_word_data = "../data/course_data/stop_words_handpicked.csv"
    try:
        stopwords_df = pd.read_csv(common_word_data)
        custom_stopwords = set(stopwords_df["Word"].dropna().str.lower().tolist())
    except FileNotFoundError:
        custom_stopwords = set()
    stop_words = set(stopwords.words("english")).union(custom_stopwords)
    return [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]
df = pd.read_csv('../data/graph_data/graph_connections.csv')
text = df.desc1.values.tolist()

# remove any other punctuation
def sent_to_words(sentences):
    for sentence in sentences:
        yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))  # deacc=True removes punctuations

# Process the text with spaCy
def lemmatize_text(texts):
    texts_out = []
    for sent in texts:
        doc = nlp(" ".join(sent)) 
        texts_out.append([token.lemma_ for token in doc])
    return texts_out

data_words = list(sent_to_words(text))
data_words_nostops = remove_stopwords(data_words)
data_words_nostops = lemmatize_text(data_words_nostops)

# initialize spacy 'en' model, keeping only tagger component (for efficiency)
nlp = spacy.load('en_core_web_sm', disable=['parser', 'ner'])
id2word = corpora.Dictionary(data_words_nostops)
texts = data_words_nostops
corpus = [id2word.doc2bow(text) for text in texts]

# Build LDA model! (generates toppics from all descriptions)
lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                           id2word=id2word,
                                           num_topics=25, 
                                           random_state=100,
                                           update_every=1,
                                           chunksize=100,
                                           passes=100,
                                           alpha=0.5, #topics
                                           eta=0.5, #words
                                           per_word_topics=True)
doc_lda = lda_model[corpus]

# Get topics from LDA model
topics = lda_model.show_topics(num_topics=25, num_words=10, formatted=False)

# Find plerplexity and coherence score of model to adjust lda_model parameters
def testModel():
    print('\nPerplexity: ', lda_model.log_perplexity(corpus))  # a measure of how good the model is. lower the better.
    topics_dict = {"Topic": [], "Words": []}
    for topic_num, words in topics:
        word_list = ", ".join([word for word, prob in words])
        topics_dict["Topic"].append(f"Topic {topic_num}")
        topics_dict["Words"].append(word_list)
    df_topics = pd.DataFrame(topics_dict)
    df_topics.to_csv("../data/metadata_output/lda_topics.csv", index=False)
    print("Topics saved to lda_topics.csv")
    coherence_model_lda = CoherenceModel(model=lda_model, texts=data_words_nostops, dictionary=id2word, coherence='u_mass')
    coherence_lda = coherence_model_lda.get_coherence()
    print('Coherence Score (UMass):', coherence_lda) # how understandable the actual topic is (not super reliable in my experience)

# get topic keywords for each description
def find_common_topic(desc1, id2word, lda_model):
    processed_text1 = list(sent_to_words([desc1]))
    processed_text1 = remove_stopwords(processed_text1)
    bow_vector1 = id2word.doc2bow(processed_text1[0]) 
    #output: topic ids and probability description is in this topic
    topics1 = lda_model.get_document_topics(bow_vector1, minimum_probability=None, minimum_phi_value=None) #return all topics, and consider all words
    top_topic1 = max(topics1, key=lambda x: x[1])[0] if topics1 else None  # The topic with highest probability
    topic_terms1 = lda_model.get_topic_terms(top_topic1, topn=5) # get keywords
    keywords = [id2word[word_id] for word_id, _ in topic_terms1]
    return keywords**

# loop over each row in the dataframe
for index, row in df.iterrows():
    desc1 = row['desc1']
    desc2 = row['desc2']
    keywords1 = find_common_topic(desc1, id2word, lda_model)
    keywords2 = find_common_topic(desc2, id2word, lda_model)
    df.at[index, 'keywords1'] = ', '.join(keywords1)
    df.at[index, 'keywords2'] = ', '.join(keywords2)

df.to_csv('../data/graph_data/current_graph_topics.csv', index=False)   
print("success")