import pandas as pd
import numpy as np

def filter_courses(df):
    """
    Filters out PE classes and MUSC classes that are 1 or 2 credits from a course dataset
    
    Parameters:
    df (pandas.DataFrame): DataFrame containing course information
    
    Returns:
    pandas.DataFrame: Filtered DataFrame with PE and specific MUSC courses removed
    """
    # Create a copy to avoid modifying the original DataFrame
    df = df.copy()
    
    # Convert Credits column to numeric, handling NaN values
    # Extract numbers from the credits string and convert to float
    df['Credits'] = df['Credits'].str.extract('(\d+)').astype(float)
    
    # Create mask for courses to keep
    keep_mask = ~(
        # Remove all PE courses
        df['Course Number'].str.startswith('PE', na=False) |
        # Remove MUSC courses that are 1 or 2 credits
        ((df['Course Number'].str.startswith('MUSC', na=False)) & 
         (df['Credits'].isin([1, 2])))
         |
        df['Course Number'].str.contains(r'\b400\b', na=False)
    )
    
    # Apply filter
    filtered_df = df[keep_mask]
    
    # Convert Credits back to original format, handling NaN values
    filtered_df['Credits'] = filtered_df['Credits'].apply(
        lambda x: f"{int(x)} credits" if pd.notnull(x) else ""
    )
    
    return filtered_df

def process_course_data(file_path):
    """
    Reads course data from CSV and applies filtering
    
    Parameters:
    file_path (str): Path to the CSV file containing course data
    
    Returns:
    pandas.DataFrame: Processed and filtered course data
    """
    # Read CSV file
    df = pd.read_csv(file_path)
    
    # Apply filtering
    filtered_df = filter_courses(df)
    
    return filtered_df

filtered_courses = process_course_data('courses2.csv')
filtered_courses.to_csv('filtered_courses.csv', index=False)