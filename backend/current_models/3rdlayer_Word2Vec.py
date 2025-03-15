''' Author: Markus Gunadi
Description: Chooses 1-2 Keywords to represent each connection in our graph. We use Word2Vec to vectorize each word
in the source course description before performing cosine similarity on the word and the connecting node description
keywords and description. The highest avereged scored word is chosen for the connection.
Documentation from: https://radimrehurek.com/gensim/models/word2vec.html
Tutorial: https://radimrehurek.com/gensim/models/word2vec.html
'''
import gensim, logging
import pandas as pd
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import os
import numpy as np
import gensim.downloader
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
import re

model = gensim.downloader.load('word2vec-google-news-300')

common_word_data = "../data/course_data/stop_words_handpicked.csv"

stopwords_df = pd.read_csv(common_word_data)
custom_stopwords = set(stopwords_df["Word"].dropna().str.lower().tolist())
stop_words = set(stopwords.words("english")).union(custom_stopwords)

# clean up course description, remove special characters, stopwords and numbers
def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    words = word_tokenize(text)
    # remove stopwords
    words = [word for word in words if word not in stop_words]
    return words

# function to find the highest similarity word(s) for each directed connection
def find_highlights(desc1, desc2, keywords1, keywords2, model):
    target_words = preprocess_text(desc2)
    source_words = preprocess_text(desc1)
    keywords1 = preprocess_text(keywords1)
    keywords2 = preprocess_text(keywords2)
    
    if len(target_words) == 0 or len(source_words) == 0:
        return None
    
    highest_word1 = ""
    highest_ave1 = 0
    highest_word2 = ""
    highest_ave2 = 0
    
    # compare each word in desc2 to each word in desc1
    for word1 in source_words:
        if word1 in model:
            ave_similarity = 0
            count = 0
            for keyword in keywords2:
                if keyword in model:
                    ave_similarity += model.similarity(word1, keyword)
                    count += 1
            for word2 in target_words:
                if word2 in model:
                    ave_similarity += model.similarity(word1, word2)
                    count = count + 1
            if ave_similarity > highest_ave1:
                highest_ave1 = ave_similarity
                highest_word1 = word1
    #repeat so that each connection has the same words (no matter which direction)
    for word2 in target_words:
        if word2 in model:
            ave_similarity = 0
            count = 0
            for keyword in keywords1:
                if keyword in model:
                    ave_similarity += model.similarity(word2, keyword)
                    count += 1
            for word1 in source_words:
                if word1 in model:
                    ave_similarity += model.similarity(word2, word1)
                    count = count + 1
            if ave_similarity > highest_ave2:
                highest_ave2 = ave_similarity
                highest_word2 = word2
    # if words are the same, return 1 word    
    if highest_word2 == highest_word1: 
        return highest_word1

    top_words = highest_word2 + " " + highest_word1
    return top_words

df = pd.read_csv('../data/graph_data/current_graph_topics.csv')

# list to store the most similar words
highlight_words = []

# loop over each row in the dataframe
for index, row in df.iterrows():
    desc1 = row['desc1']
    desc2 = row['desc2']
    keywords1 = row['keywords1']
    keywords2 = row['keywords2']
    highlights = find_highlights(desc1, desc2, keywords1, keywords2, model)
    highlight_words.append(highlights)

df['highlight_words'] = highlight_words

df.to_csv('../data/graph_data/current_graph_data.csv', index=False)
print("success!")
