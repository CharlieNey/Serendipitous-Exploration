import pandas as pd
import numpy as np

# https://stackoverflow.com/questions/61929833/how-to-filter-missing-data-rows-using-python
# https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.mask.html
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
    df['Credits'] = df['Credits'].str.extract('(\\d+)').astype(float)
    # Create mask for courses to keep
    keep_mask = ~(
        # Remove all PE courses
        df['Course Number'].str.startswith('PE', na=False) |

        df['Course Number'].str.startswith('OCP', na=False) |

        df['Course Number'].str.startswith('IDSC', na=False) |

        df['Time'].isna() |

        # Remove MUSC courses that are 1 or 2 credits
        ((df['Course Number'].str.startswith('MUSC', na=False)) & 
         (df['Credits'].isin([1, 2, 3]))) |
        
        df['Course Number'].str.contains(r'\b400\b', na=False)
    )
    
    # Apply filter
    filtered_df = df[keep_mask]
    
    # Convert Credits back to original format, handling NaN values
    '''
    filtered_df['Credits'] = filtered_df['Credits'].apply(
        lambda x: f"{int(x)} credits" if pd.notnull(x) else ""
    )
    '''
    
    
    
    print(df.shape)  # Before filtering
    print(filtered_df.shape)  # After filtering

    print(df.columns)  # Before filtering
    print(filtered_df.columns)  # After filtering

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

filtered_courses = process_course_data('backend/data/course_data/courses2.csv')
filtered_courses.to_csv('backend/data/course_data/filtered_courses/filtered_courses.csv', index=False)