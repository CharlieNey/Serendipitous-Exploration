import pandas as pd
from collections import Counter

df = pd.read_csv('data/doc2vec_top10_output.csv')

# Find department by extracting first 4 chars
df['course_1_department'] = df['Course_1'].str[:4]
df['course_2_department'] = df['Course_2'].str[:4]

# Function to find the most common course_2 title within a group
def most_common_title(group):
    filtered_group = group[group['course_1_department'] != group['course_2_department']]
    if filtered_group.empty:  # Handle case where no titles remain after filtering
        return "No recommendations"
    return Counter(filtered_group['course_2_department']).most_common(1)[0][0]

# Group by department and find the most common course_2 
most_common_titles_by_department = df.groupby('course_1_department').apply(most_common_title).to_dict()

# Find the most common course_2 in csv
common_title = Counter(df['Course_2']).most_common(1)[0][0]
# Calculate the average similarity score
average_similarity = df['Similarity'].mean()


# Group by course_1_department and find the most common course_2_title
metadata_rows = []
for department, group in df.groupby('course_1_department'):
    common_title = most_common_title(group)
    avg_similarity = group['Similarity'].mean()
    metadata_rows.append({
        "Department": department,
        "Most recommended": common_title,
        "Average_Similarity_Score": round(avg_similarity, 3),
    })
# Convert metadata rows into a DataFrame for a table-like structure
metadata_df = pd.DataFrame(metadata_rows)

# Display the metadata table
print(metadata_df)
