# import pandas as pd
# import numpy as np

# def filter_courses(df):
#     """
#     Filters out PE classes and MUSC classes that are 1 or 2 credits from a course dataset
    
#     Parameters:
#     df (pandas.DataFrame): DataFrame containing course information
    
#     Returns:
#     pandas.DataFrame: Filtered DataFrame with PE and specific MUSC courses removed
#     """
#     # Create a copy to avoid modifying the original DataFrame
#     df = df.copy()
    
#     # Convert Credits column to numeric, handling NaN values
#     # Extract numbers from the credits string and convert to float
#     df['Credits'] = df['Credits'].str.extract('(\d+)').astype(float)
    
#     # Create mask for courses to keep
#     keep_mask = ~(
#         # Remove all PE courses
#         df['Course Number'].str.startswith('PE', na=False) |

#         df['Course Number'].str.startswith('OCP', na=False) |

#         # Remove MUSC courses that are 1 or 2 credits
#         ((df['Course Number'].str.startswith('MUSC', na=False)) & 
#          (df['Credits'].isin([1, 2])))
#          |
#         df['Course Number'].str.contains(r'\b400\b', na=False)
#     )
    
#     # Apply filter
#     filtered_df = df[keep_mask]
    
#     # Convert Credits back to original format, handling NaN values
#     filtered_df['Credits'] = filtered_df['Credits'].apply(
#         lambda x: f"{int(x)} credits" if pd.notnull(x) else ""
#     )
    
#     print(df.shape)  # Before filtering
#     print(filtered_df.shape)  # After filtering

#     print(df.columns)  # Before filtering
#     print(filtered_df.columns)  # After filtering

#     return filtered_df

# def process_course_data(file_path):
#     """
#     Reads course data from CSV and applies filtering
    
#     Parameters:
#     file_path (str): Path to the CSV file containing course data
    
#     Returns:
#     pandas.DataFrame: Processed and filtered course data
#     """
#     # Read CSV file
#     df = pd.read_csv(file_path)
    
#     # Apply filtering
#     filtered_df = filter_courses(df)
    
#     return filtered_df

# filtered_courses = process_course_data('data/courses2.csv')
# filtered_courses.to_csv('data/filtered_courses.csv', index=False)


import pandas as pd
import numpy as np

def filter_courses(df):
    """
    Filters out PE classes, OCP classes, and MUSC classes that are 1 or 2 credits from a course dataset.
    Also removes courses with '400' in the course number.

    Parameters:
    df (pandas.DataFrame): DataFrame containing course information

    Returns:
    pandas.DataFrame: Filtered DataFrame with PE, OCP, and specific MUSC courses removed
    """
    # Create a copy to avoid modifying the original DataFrame
    df = df.copy()

    # Convert Credits column to numeric, handling NaN values
    # Extract numbers from the credits string and convert to float
    df['Credits'] = pd.to_numeric(df['Credits'].str.extract(r'(\d+)', expand=False), errors='coerce')

    # Create mask for courses to keep
    keep_mask = ~(
        # Remove all PE courses
        df['Course Number'].str.startswith('PE', na=False) |

        # Remove all OCP courses
        df['Course Number'].str.startswith('OCP', na=False) |

        # Remove MUSC courses that are 1 or 2 credits
        df['Course Number'].str.startswith('MUSC', na=False) |
         
        df['Credits'].isin([1, 2]) |

        # Remove courses with '400' in the course number
        df['Course Number'].str.contains(r'\b400\b', na=False)
    )

    # Apply filter
    filtered_df = df.loc[keep_mask].copy()

    # Convert Credits back to original format, handling NaN values
    filtered_df.loc[:, 'Credits'] = filtered_df['Credits'].apply(
        lambda x: f"{int(x)} credits" if pd.notnull(x) else ""
    )

    # Debugging prints
    print("Original DataFrame shape:", df.shape)  # Before filtering
    print("Filtered DataFrame shape:", filtered_df.shape)  # After filtering
    print("Original DataFrame columns:", df.columns.tolist())  # Before filtering
    print("Filtered DataFrame columns:", filtered_df.columns.tolist())  # After filtering

    return filtered_df

def process_course_data(file_path):
    """
    Reads course data from CSV and applies filtering.

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

# Process the course data and save the filtered results
filtered_courses = process_course_data('data/courses2.csv')
filtered_courses.to_csv('data/filtered_courses.csv', index=False)