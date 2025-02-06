import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np

# Load the CSV file (replace 'your_file.csv' with your actual file path)
df = pd.read_csv('../data/graph_data/charlie_graph.csv')

# Combine the two course descriptions into a single text column for topic modeling
df['combined_description'] = df['Description_1'] + " " + df['Description_2']

# Text preprocessing function
def preprocess_text(text):
    import re
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer

    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\d+', '', text)

    # Convert to lowercase and tokenize
    text = text.lower().split()

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    #print(stop_words)
    common_course_words = {'course', 'student', 'reading', 'study', 'topic', 
    'include', 'data', 'technique', 'analysis', 'research', 'work'
    , 'study', 'program', 'explore', 'experience'}
    text = [word for word in text if (word not in (stop_words and common_course_words))]

    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    text = [lemmatizer.lemmatize(word) for word in text]

    return ' '.join(text)

# preprocess the combined descriptions
df['processed_description'] = df['combined_description'].apply(preprocess_text)

# convert text to a document-term matrix
vectorizer = CountVectorizer(max_df=0.9, min_df=2, stop_words='english')
dtm = vectorizer.fit_transform(df['processed_description'])

# fit LDA model
lda_model = LatentDirichletAllocation(n_components=3, random_state=42)  # n_components = number of topics
lda_model.fit(dtm)

# extract topics
def display_topics(model, feature_names, no_top_words):
    topics = {}
    for topic_idx, topic in enumerate(model.components_):
        topics[f"Topic {topic_idx+1}"] = [feature_names[i] for i in topic.argsort()[:-no_top_words - 1:-1]]
    return topics

no_top_words = 10
feature_names = vectorizer.get_feature_names_out()
topics = display_topics(lda_model, feature_names, no_top_words)

for topic, words in topics.items():
    print(f"{topic}: {', '.join(words)}")

# Assign dominant topic to each course pair
df['dominant_topic'] = lda_model.transform(dtm).argmax(axis=1)

# Save results to CSV
df.to_csv('../data/courses_with_topics.csv', index=False)
print("Results saved to 'courses_with_topics.csv'")
