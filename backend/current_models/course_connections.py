import pandas as pd
"""
Processes course similarity data from a CSV file and constructs a directed graph representation.
It selects the top 2 most similar courses for each course and adds an additional edge if the similarity exceeds 0.95.
"""


df = pd.read_csv('data/doc2vec_output/doc2vec_output_top_10.csv')
df = df[df['Similarity'] < 1]

unique_pairs = set()
graph_edges = []

def add_edge(course1, course2, similarity, desc1, desc2):
    """Adds an edge and its reverse to the graph list."""
    pair = (course1, course2)
    if pair not in unique_pairs:
        unique_pairs.add(pair)
        graph_edges.append([course1, course2, similarity, desc1, desc2])
        graph_edges.append([course2, course1, similarity, desc2, desc1]) 

for course, group in df.groupby('Course_1'):
    sorted_group = group.sort_values('Similarity', ascending=False)
    
    # find the top 2 most similar courses
    top_3 = sorted_group.head(2)
    for _, row in top_3.iterrows():
        add_edge(row['Course_1'], row['Course_2'], row['Similarity'], row['Description_1'], row['Description_2'])
    
    # add 1 additional course with similarity > 0.95
    additional = sorted_group.iloc[2:]  # skip the top 2
    additional_filtered = additional[additional['Similarity'] > 0.95].head(1)
    for _, row in additional_filtered.iterrows():
        add_edge(row['Course_1'], row['Course_2'], row['Similarity'], row['Description_1'], row['Description_2'])


output_df = pd.DataFrame(graph_edges, columns=['source node', 'target node', 'similarity score', 'desc1', 'desc2'])
output_df.to_csv('data/graph_data/graph_connections.csv', index=False)
print("Graph data saved to data/graph_data/graph_connections.csv'")