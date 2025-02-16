# import modules & set up logging
import gensim, logging
import pandas as pd
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import os
import gensim
import numpy as np
import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity
import gensim.downloader
# model_path = os.path.join(os.getcwd(), 'connection_model')
# model = gensim.models.Word2Vec.load(model_path)
model = gensim.downloader.load('glove-wiki-gigaword-300')
# model = api.load('word2vec-google-news-300')


# preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = word_tokenize(text)
    
    # remove stopwords
    common_word_data = "../data/course_data/stop_words_handpicked.csv"
    stopwords_df = pd.read_csv(common_word_data)
    custom_stopwords = set(stopwords_df["Word"].dropna().str.lower().tolist())
    stop_words = set(stopwords.words("english")).union(custom_stopwords)
    words = [word for word in words if word not in stop_words]
    # print(words[2])
    return words

# function to find the highest similarity word
def find_highest_similarity(desc1, desc2, model):
    words_desc1 = preprocess_text(desc1)
    words_desc2 = preprocess_text(desc2)
    
    if len(words_desc1) == 0 or len(words_desc2) == 0:
        return None  # if either description is empty after preprocessing, return None
    
    highest_similarity = 0  
    most_similar_word = "none" 
    
    # compare each word in desc1 to each word in desc2
    for word1 in words_desc1:
        if word1 in model:  # check if the word is in the model's vocabulary
            ave_similarity = 0
            count = 0 
            for word2 in words_desc2:
                if word2 in model:
                    ave_similarity += model.similarity(word1, word2)
                    count += 1
            if count > 0:  # avoid division by zero
                ave_similarity /= count
                if ave_similarity > highest_similarity:
                    highest_similarity = ave_similarity
                    most_similar_word = word1        
    # print(most_similar_word)
    return most_similar_word

df = pd.read_csv('../data/graph_data/graph_connections.csv')  # Replace with your new CSV file path

# list to store the most similar words
most_similar_words = []

# loop over each row in the dataframe
for index, row in df.iterrows():
    desc1 = row['desc1']
    desc2 = row['desc2']
    result = find_highest_similarity(desc1, desc2, model)
    most_similar_words.append(result)

print(most_similar_words)
df['most_similar_word'] = most_similar_words
df.to_csv('../data/graph_data/current_graph_data.csv', index=False)
