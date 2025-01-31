**To run graph**
1. After installing postgresql, run: **brew services start postgresql**
2. Start postgres command line by typing **psql postgres**
3. If you don't have the "courses" database, create it by typing **CREATE DATABASE courses;**  (to see your list of dbs, type **\l**)
4. Connect to "courses" database by typing **\c courses**
5. Type **quit** to exit psql command line
6. cd into backend, then run **psql -U _your_username_ -d courses < createTable.sql**
7. If you dont have node installed, type **brew install node**
8. Open a new terminal, run **node server.js**
9. Open another terminal, cd into frontend, run **npm start**
10. See the graph by clicking the _Graph!_ button from the home page!
11. _If you don't have the courses table: _ run **psql -U _your_username_ -d courses < zoeyTable.sql**
