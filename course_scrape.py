import requests
from bs4 import BeautifulSoup
import csv

# Making a GET request
url = 'https://www.carleton.edu/catalog/current/search/?text=%20&term=24FA'
r = requests.get(url)

if r.status_code == 200:
    soup = BeautifulSoup(r.content, 'html.parser')
    
    course_list = soup.find('ul', class_='courseSearchResults')
    courses = []

    # Loop through each course item (each <li> with an id starting with "course_")
    for course_item in course_list.find_all('li', id=lambda x: x and x.startswith('course_')):
        # --- Extract basic course info from the title bar ---
        title_bar = course_item.find('h3', class_='courseTitleBar')
        course_number = title_bar.find('span', class_='courseNumber').get_text(strip=True) if title_bar.find('span', class_='courseNumber') else ""
        course_title  = title_bar.find('span', class_='courseTitle').get_text(strip=True) if title_bar.find('span', class_='courseTitle') else ""
        credits       = title_bar.find('span', class_='credits').get_text(strip=True) if title_bar.find('span', class_='credits') else ""
        
        # --- Extract course description ---
        description_div = course_item.find('div', class_='courseDetailWrapper')
        description = description_div.get_text(strip=True) if description_div else ""
        
        # --- Extract additional metadata from the meta wrapper ---
        offered = ""
        liberal_arts_reqs = ""
        prerequisites = ""
        tags = ""
        meta_div = course_item.find('div', class_='courseMetaWrapper')
        if meta_div:
            offered_li = meta_div.find('li', class_='courseMeta--termsOffered')
            if offered_li and offered_li.find('span'):
                offered = offered_li.find('span').get_text(strip=True)
            
            liberal_arts_li = meta_div.find('li', class_='courseMeta--liberalArtsReqs')
            if liberal_arts_li:
                # Join texts from all <a> tags
                liberal_arts_reqs = " | ".join(a.get_text(strip=True) for a in liberal_arts_li.find_all('a'))
            
            prereq_li = meta_div.find('li', class_='courseMeta--preReqs')
            if prereq_li and prereq_li.find('span'):
                prerequisites = prereq_li.find('span').get_text(" ", strip=True)
            
            tags_li = meta_div.find('li', class_='courseMeta--tags')
            if tags_li:
                tags = " | ".join(a.get_text(strip=True) for a in tags_li.find_all('a'))
        
        # --- Extract section information ---
        sections = []
        section_grid = course_item.find('div', class_='section-grid')
        if section_grid:
            for section in section_grid.find_all('div', class_='course-section'):
                # Get all text in the section and join details with " | "
                section_text = section.get_text(separator=" | ", strip=True)
                sections.append(section_text)
        sections_joined = " || ".join(sections)
        
        # Build a dictionary for the course
        course_data = {
            'Course Number': course_number,
            'Course Title': course_title,
            'Credits': credits,
            'Description': description,
            'Offered': offered,
            'Liberal Arts Requirements': liberal_arts_reqs,
            'Prerequisites': prerequisites,
            'Tags': tags,
            'Sections': sections_joined
        }
        courses.append(course_data)
    
    # Write the data to a CSV file
    with open('courses.csv', mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ['Course Number', 'Course Title', 'Credits', 'Description', 
                      'Offered', 'Liberal Arts Requirements', 'Prerequisites', 'Tags', 'Sections']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for course in courses:
            writer.writerow(course)
    
    print("CSV file 'fall2024courses.csv' has been created successfully.")
else:
    print("Failed to retrieve the page")
