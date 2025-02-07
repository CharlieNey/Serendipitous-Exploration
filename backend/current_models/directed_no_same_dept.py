import pandas as pd
from collections import Counter

df = pd.read_csv('data/doc2vec_top10_output.csv')

# find department by extracting first 4 chars
df['course_1_department'] = df['Course_1'].str[:4]
df['course_2_department'] = df['Course_2'].str[:4]

# function to find the most recomended course_2 department per department
def most_common_title(group):
    filtered_group = group[group['course_1_department'] != group['course_2_department']]
    if filtered_group.empty:  # Handle case where no titles remain after filtering
        return "No recommendations"
    return Counter(filtered_group['course_2_department']).most_common(1)[0][0]

# group by department and find the most common course_2 
most_common_titles_by_department = df.groupby('course_1_department').apply(most_common_title).to_dict()

# find the most common course_2 in csv
common_title = Counter(df['Course_2']).most_common(1)[0][0]

# calculate the average similarity score
average_similarity = df['Similarity'].mean()