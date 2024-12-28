// importing frameworks and libraries: express, Node.js's path module, the pool class from the pg library, and cors

const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 
const cors = require('cors');  

const app = express(); // express framework
const PORT = 3000;

app.use(cors()); // enable CORS which allows React frontend to access this backend API 
app.use(express.json());       

// setting up postgreSQL connection
const pool = new Pool({ 
    user: "postgres",           
    host: "localhost",          
    database: "coursesdb",      
    password: "skibidi", // my postgres password
    port: 5432, // default port num         
});

// server sends an homepage.html file to the user's browser when they visit the root URL (/) of our server
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, '/homepage.html')); 
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

// starting the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
