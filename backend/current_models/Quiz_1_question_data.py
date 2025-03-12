'''
Author: Markus Gunadi
Description: This script finds the top 5 recommended departments for each department in the graph for Quiz 1 Question 1. It excludes classes 
from the same department in the count and may sometimes find less than 5 recommended departments if not enough connections exist in the graph.
'''
import pandas as pd
from collections import Counter

df = pd.read_csv('../data/graph_data/current_graph_data.csv')
df['source node'] = df['source node'].str.split(' ').str[0]
df['target node'] = df['target node'].str.split(' ').str[0]

# Function to find the most common 5 course_2 titles within a group
def most_common_titles(group, top_n=5):
    filtered_group = group[group['source node'] != group['target node']]
    if filtered_group.empty:
        return ["No recommendations"] * top_n
    common_titles = Counter(filtered_group['target node']).most_common(top_n)
    return [title[0] for title in common_titles]

# group by 'source node' (department) and find the most common 5 course_2 titles
most_common_titles_by_department = df.groupby('source node').apply(most_common_titles).to_dict()
metadata_rows = []

for department, group in df.groupby('source node'):
    common_titles = most_common_titles(group, top_n=5)
    metadata_rows.append({
        "Department": department,
        "Top_5_Recommended": ','.join(common_titles),
    })
metadata_df = pd.DataFrame(metadata_rows)
metadata_df.to_csv('../data/graph_data/recommended_departments.csv', index=False)
