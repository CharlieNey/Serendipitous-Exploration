import pandas as pd

# Load the CSV file
df = pd.read_csv('data/doc2vec_output/doc2vec_output_top_10.csv')

# Filter out rows where similarity is 1 (self-similarity)
df = df[df['Similarity'] < 1]

# Track unique pairs of courses to avoid duplicates
unique_pairs = set()

# Group rows by 'Course_1' and process each group
graph_edges = []

for course, group in df.groupby('Course_1'):
    sorted_group = group.sort_values('Similarity', ascending=False)
    
    # Select the top 3 most similar courses
    top_3 = sorted_group.head(3)
    for _, row in top_3.iterrows():
        # Create a sorted tuple to represent the pair (order doesn't matter)
        pair = tuple(sorted([row['Course_1'], row['Course_2']]))
        if pair not in unique_pairs:
            unique_pairs.add(pair)
            graph_edges.append([row['Course_1'], row['Course_2'], row['Similarity'], row['Description_1'], row['Description_2']])
    
    # Select up to 4 additional courses with similarity > 0.75
    additional = sorted_group.iloc[3:]  # Skip the top 3
    additional_filtered = additional[additional['Similarity'] > 0.75].head(4)
    for _, row in additional_filtered.iterrows():
        # Create a sorted tuple to represent the pair (order doesn't matter)
        pair = tuple(sorted([row['Course_1'], row['Course_2']]))
        if pair not in unique_pairs:
            unique_pairs.add(pair)
            graph_edges.append([row['Course_1'], row['Course_2'], row['Similarity'], row['Description_1'], row['Description_2']])

# Create a new DataFrame for the output
output_df = pd.DataFrame(graph_edges, columns=['source node', 'target node', 'similarity score', 'desc1', 'desc2'])

# Save to a new CSV file
output_df.to_csv('data/graph_data/charlie_graph.csv', index=False)

print("Graph data saved to 'data/graph_data/charlie_graph.csv'")