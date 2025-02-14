
import requests
from bs4 import BeautifulSoup
import csv

# Making a GET request
r = requests.get('https://www.carleton.edu/catalog/current/search/?text=%20&term=25WI')

if r.status_code == 200:
    soup = BeautifulSoup(r.content, 'html.parser')

    course_list = soup.find('ul', class_='courseSearchResults')

    descriptions = []

    for course_item in course_list.find_all('div', class_='courseDetailWrapper'): 
         descriptions.append(course_item.get_text(strip=True))
    
    #CSV
    with open('courses.csv', mode='w', newline='', encoding='utf-8') as file:
         writer = csv.writer(file)

         writer.writerow('Description')
         for description in descriptions:
             writer.writerow([description])
    print("CSV file 'winter2025courses.csv' has been created successfully.")
else:
    print("Failed to retrieve the page")