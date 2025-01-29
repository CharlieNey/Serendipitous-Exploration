import pandas as pd

# Paths to files
similarity_file = 'data/doc2vec_output/doc2vec_output_sorted.csv'

# Step 1: Load similarity data
similarity_df = pd.read_csv(similarity_file)

# Step 2: Extract departments from course numbers
def extract_department(course_number):
    """Extract department prefix from the course number."""
    if isinstance(course_number, str):
        return course_number.split(' ')[0]  # Take characters before the first space
    return None

similarity_df["Department_1"] = similarity_df["Course_1"].apply(extract_department)
similarity_df["Department_2"] = similarity_df["Course_2"].apply(extract_department)

# Drop rows where department mapping fails (e.g., invalid course numbers)
similarity_df = similarity_df.dropna(subset=["Department_1", "Department_2"])

# Step 3: Ensure unique department pairs and remove self-comparisons
# Sort department pairs alphabetically and filter duplicates
similarity_df["Dept_Pair"] = similarity_df.apply(
    lambda row: tuple(sorted([row["Department_1"], row["Department_2"]])),
    axis=1
)
# Remove self-comparisons and keep only unique department pairs
unique_pairs_df = similarity_df[similarity_df["Department_1"] != similarity_df["Department_2"]]
unique_pairs_df = unique_pairs_df.drop_duplicates(subset="Dept_Pair")

# Step 4: Group by department pairs and compute average similarity
dept_similarity = (
    unique_pairs_df
    .groupby("Dept_Pair")["Similarity"]
    .mean()
    .reset_index()
    .sort_values(by="Similarity", ascending=False)
)


# Split Dept_Pair back into separate columns for easier readability
dept_similarity[["Department_1", "Department_2"]] = pd.DataFrame(dept_similarity["Dept_Pair"].tolist(), index=dept_similarity.index)
dept_similarity = dept_similarity.drop(columns=["Dept_Pair"])

# Step 5: Save the department-to-department similarity
output_file = 'data/department_similarity_filtered.csv'
dept_similarity.to_csv(output_file, index=False)
print(f"Department-to-department similarity saved to {output_file}.")
