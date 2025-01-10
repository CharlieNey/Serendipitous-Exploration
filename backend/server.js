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

app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, '/')); 
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


// defining the /api/courses api route
app.get('/api/nodes', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM Nodes");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});

// defining the /api/courses api route
app.get('/api/connections', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM Connections");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});

// starting the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
