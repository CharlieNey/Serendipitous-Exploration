import pandas as pd

# Load the CSV file
file_path = "../data/graph_data/current_graph_data.csv"  # Change this to your actual file path
df = pd.read_csv(file_path)

# Specify the columns you want to print
column3 = "highlight_words"  # Change this to the actual column name
column1 = "source node"  # Change this to the actual column name
column2 = "target node"  # Change this to the actual column name

# Print the selected columns

# Select and save to a new CSV file
new_df = df[[column1, column2, column3]]
new_df.to_csv("filtered_output.csv", index=False)

print("Filtered CSV saved as 'filtered_output.csv'")
