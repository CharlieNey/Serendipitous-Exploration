# import modules & set up logging
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

# model_path = os.path.join(os.getcwd(), 'connection_model')
# model = gensim.models.Word2Vec.load(model_path)
model = gensim.downloader.load('glove-wiki-gigaword-300')
# model = api.load('word2vec-google-news-300')

# preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)

    words = word_tokenize(text)
    # remove stopwords
    common_word_data = "../data/course_data/stop_words_handpicked.csv"
    try:
        stopwords_df = pd.read_csv(common_word_data)
        custom_stopwords = set(stopwords_df["Word"].dropna().str.lower().tolist())
    except FileNotFoundError:
        custom_stopwords = set()
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

# function to find the highest similarity word
def find_highlights(desc1, desc2, model):
    # switch to 
    target_words = preprocess_text(desc2)
    source_words = preprocess_text(desc1)
    
    if len(target_words) == 0 or len(source_words) == 0:
        return None  # if either description is empty after preprocessing, return None
    
    # similarity_scores_word1 = []
    # similarity_scores_word2 = []
    highest_word1 = ""
    highest_ave1 = 0
    highest_word2 = ""
    highest_ave2 = 0
    
    # compare each word in desc2 to each word in desc1
    for word1 in source_words:
        if word1 in model:
            ave_similarity = 0
            count = 0
            for word2 in target_words:
                if word2 in model:
                    ave_similarity += model.similarity(word1, word2)
                    count = count + 1
            if ave_similarity > highest_ave1:
                # ave_similarity /= count
                highest_ave1 = ave_similarity
                highest_word1 = word1
                # if ave_similarity >= threshold:
                # if ((not (word1 in similarity_scores_word1)) & (not (word1 in similarity_scores_word2))):
                # similarity_scores_word1.append(word1)
                # similarity_scores.append((word1, word2))
                # print(ave_similarity, word1, word2)

    for word2 in target_words:
        if word2 in model:
            ave_similarity = 0
            count = 0
            for word1 in source_words:
                if word1 in model:
                    ave_similarity += model.similarity(word2, word1)
                    count = count + 1
            if ave_similarity > highest_ave2:
                highest_ave2 = ave_similarity
                highest_word2 = word2
                # ave_similarity /= count
                # if ave_similarity >= threshold:
                # if ((not (word2 in similarity_scores_word1)) & (not (word1 in similarity_scores_word2))):
                # similarity_scores_word2.append(word2)
                # similarity_scores.append((word1, word2))
                # print(ave_similarity, word1, word2)

    # similarity_scores_word1.sort(reverse=True, key=lambda x: x[0])
    # similarity_scores_word1.sort(reverse=True, key=lambda x: x[0])

    # top_2_words_with_similarity = similarity_scores[:2]
    # top_2_word1 = [words for words in similarity_scores_word1[:1]]
    # top_2_word2 = [words for words in similarity_scores_word2[:1]]
    if highest_word2 == highest_word1: 
        return highest_word1

    top_words = highest_word2 + " " + highest_word1

    return top_words

df = pd.read_csv('../data/graph_data/graph_connections.csv')

# list to store the most similar words
most_similar_words = []
highlight_words = []

# loop over each row in the dataframe
for index, row in df.iterrows():
    desc1 = row['desc1']
    desc2 = row['desc2']

    # connect_word = find_highest_similarity(desc1, desc2, model)
    highlights = find_highlights(desc1, desc2, model)
    # most_similar_words.append(connect_word)
    highlight_words.append(highlights)

    # print("Top 10 words with their average similarity scores:")
    # for pair, score in highlight_words:
        # print(f"Pair: {pair}, Similarity Score: {score}")

# df['most_similar_word'] = most_similar_words
df['highlight_words'] = highlight_words

# output_words = []
# for index, row in df.iterrows():
#     top_4_words = row['highlight_words']
#     output = model.most_similar(positive=top_4_words)
#     output_words.append(output)

# df['prediction'] = output_words

df.to_csv('../data/graph_data/current_graph_data.csv', index=False)
print("success!")
