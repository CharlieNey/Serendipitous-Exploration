import pandas as pd
import nltk
import os

# Make sure to download the necessary NLTK data for sentence tokenization
nltk.download('punkt')

# Function to split paragraphs into sentences
def split_paragraphs_to_sentences(paragraph):
    if isinstance(paragraph, str) and paragraph.strip():  # Check if paragraph is a non-empty string
        return nltk.sent_tokenize(paragraph)
    else:
        return []  # Return an empty list for empty or invalid paragraphs

# Read CSV files
df1 = pd.read_csv('../data/course_data/fall2024courses.csv')  # Replace with your file path
df2 = pd.read_csv('../data/course_data/winter2025courses.csv')  # Replace with your file path

# Combine the descriptions from both files into a single list
descriptions = pd.concat([df1['Description'], df2['Description']])

# Create an empty list to hold sentences
sentences = []

# Split each description into sentences and append them
for description in descriptions:
    sentences.extend(split_paragraphs_to_sentences(description))

# Write the sentences to a new CSV file
sentences_df = pd.DataFrame(sentences, columns=['Sentence'])
sentences_df.to_csv('../data/course_data/training_sentences.csv', index=False)

print("CSV file with one sentence per line has been created!")

# import modules & set up logging
import gensim, logging
import pandas as pd
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
 
sentences = ('../data/course_data/training_sentences.csv') # a memory-friendly iterator
model = gensim.models.Word2Vec(sentences)
model = gensim.models.Word2Vec(sentences, min_count=1)
model.save('connection_model')
print("success")