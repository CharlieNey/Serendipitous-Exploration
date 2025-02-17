import pandas as pd
from collections import Counter

# Read the CSV file into a DataFrame
df = pd.read_csv('../data/graph_data/current_graph_data.csv')

# Find department by extracting first chars before space
df['source node'] = df['source node'].str.split(' ').str[0]
df['target node'] = df['target node'].str.split(' ').str[0]

# Function to find the most common 5 course_2 titles within a group
def most_common_titles(group, top_n=5):
    # Exclude rows where source node equals target node
    filtered_group = group[group['source node'] != group['target node']]
    
    if filtered_group.empty:  # If no rows left after filtering, return a default message
        return ["No recommendations"] * top_n
    
    # Use Counter to find the most common 'target node' (course_2) in the filtered group
    common_titles = Counter(filtered_group['target node']).most_common(top_n)
    
    # Extract just the titles (departments)
    return [title[0] for title in common_titles]

# Group by 'source node' (department) and find the most common 5 course_2 titles
most_common_titles_by_department = df.groupby('source node').apply(most_common_titles).to_dict()

# Group by 'source node' and create a new DataFrame to store the metadata
metadata_rows = []
for department, group in df.groupby('source node'):
    common_titles = most_common_titles(group, top_n=5)
    metadata_rows.append({
        "Department": department,
        "Top_5_Recommended": ','.join(common_titles),
    })

# Convert metadata rows into a DataFrame
metadata_df = pd.DataFrame(metadata_rows)

# Save the metadata DataFrame to a CSV file
metadata_df.to_csv('../data/graph_data/recommended_departments.csv', index=False)

# Display the metadata table
print(metadata_df)
