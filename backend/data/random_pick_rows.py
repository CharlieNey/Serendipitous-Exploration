import pandas as pd

# Path to your CSV file
csv_file_path = 'data/doc2vec_output/doc2vec_output_top_10.csv'

# Load the CSV into a DataFrame
df = pd.read_csv(csv_file_path)

random_sample = df.sample(n=100, random_state=42)  # random_state for reproducibility

# Optionally, save the random sample to a new CSV
random_sample.to_csv('data/random_sample_top_10.csv', index=False)

# Print the random sample (optional)
print(random_sample)