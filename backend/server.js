// importing frameworks and libraries: express, Node.js's path module, the pool class from the pg library, and cors
import {my_user, my_database, my_password} from './psqlConfig.js';

import express from 'express';
import path from 'path';
import pkg from 'pg';
const {Pool} = pkg;
import cors from 'cors';

const app = express(); // express framework
const PORT = 3001;

app.use(cors()); // enable CORS which allows React frontend to access this backend API 
app.use(express.json());  

// setting up postgreSQL connection
const pool = new Pool({ 
    user: my_user,           
    host: "localhost",          
    database: my_database,      
    password: my_password, // my postgres password
    port: 5432, // default port num         
});

const router = express.Router(); 

// Routes
app.get('/', (req, res) => {
    res.send('Test server is running'); 
});


// defining the /api/courses api route
app.get('/api/courses', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM courses");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});


// defining the /api/nodes api route
app.get('/api/nodes', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM Nodes");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});

// defining the /api/similarities api route
app.get('/api/similarities', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM Similarities");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});

// defining the /api/:search api route - something is NOT working...
router.get('/:search', async (req, res) => { 
    try {
        const search = req.params.search;
        const query1 = "SELECT * FROM courses WHERE LOWER(SUBSTRING_INDEX(section_listings, '-', 0)) LIKE '%" + search + "%' OR LOWER(SUBSTRING_INDEX(section_listings, '-', 1)) LIKE '" + search + "%' OR LOWER(SUBSTRING_INDEX(section_listings, '-', 1)) LIKE '%" + search +"'";
        const query2 = " OR LOWER(SUBSTRING_INDEX(section_listings, '-', 1)) LIKE '%" + search + "%' OR LOWER(SUBSTRING_INDEX(section_listings, '-', 1)) LIKE '" + search + "%' OR LOWER(SUBSTRING_INDEX(section_listings, '-', 1)) LIKE '%" + search +"'";
        const query3 = " OR LOWER(description) LIKE '%" + search + "%' OR LOWER(description) LIKE '" + search + "%' OR LOWER(description) LIKE '%" + search +"'";
        const result = await pool.query(query1 + query2 + query3);

        res.json(result.rows);
    } catch (err) {
        console.error("Error querying courses:", err.message);
        res.status(500).send("Server Error");
    }
});

app.use('/mycourses', router);

// starting the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
