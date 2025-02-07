import pandas as pd

# Load the CSV file
df = pd.read_csv('../data/doc2vec_output/doc2vec_output_top_10.csv')

df = df[df['Similarity'] < 1]

# Group rows by 'Course_1' and process each group
graph_edges = []

for course, group in df.groupby('Course_1'):

    sorted_group = group.sort_values('Similarity', ascending=False)
    
    # select the top 3 most similar courses
    top_3 = sorted_group.head(3)
    graph_edges.extend(top_3[['Course_1', 'Course_2', 'Similarity', 'Description_1', 'Description_2']].values.tolist())
    
    # select up to 4 additional courses with similarity > 0.75
    additional = sorted_group.iloc[3:]  # Skip the top 3
    additional_filtered = additional[additional['Similarity'] > 0.75].head(4)
    graph_edges.extend(additional_filtered[['Course_1', 'Course_2', 'Similarity', 'Description_1', 'Description_2']].values.tolist())

# create a new DataFrame for the output
output_df = pd.DataFrame(graph_edges, columns=['source node', 'target node', 'similarity score', 'desc1', 'desc2'])

# save to a new CSV file
output_df.to_csv('../data/graph_data/charlie_graph.csv', index=False)
