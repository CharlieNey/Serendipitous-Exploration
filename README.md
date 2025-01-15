**To run dummy graph**
1. After installing postgresql, run: **brew services start postgresql**
2. Start postgres by typing **psql postgres**
3. If you don't have the "courses" database, create it by typing **CREATE DATABASE courses;**  (to see your list of dbs, type **\l**)
4. Connect to "courses" database by typing **\c courses**
5. cd into backend, then run **psql -U _your_username_ -d courses < createTable.sql**
6. Open a new terminal, run **node server.js**
7. Open another terminal, cd into frontend, run **npm start**.
8. See the graph by clicking the _Graph!_ button from the home page!
