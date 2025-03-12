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

// defining the /api/department-recommendations api route
app.get('/api/department-recommendations', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM depRecs");
        res.json(result.rows); 
    } catch (err) {
        console.error("Error fetching courses:", err.message);
        res.status(500).send("Server Error");
    }
});

// defining the /api/:search api route - something is NOT working...
router.get('/:search', async (req, res) => { 
    const departmentMap = { // if lower search term LIKE departmentMap.value, then find class...
        'AFST': 'African Studies',
        'AMST': 'American Studies',
        'ARBC': 'Arabic',
        'ARCN': 'Archaelogy',
        'ARTH': 'Art History',
        'ASLN': 'Asian Languages and Literatures',
        'ASST': 'Asian Studies',
        'ASTR': 'Astronomy',
        'BIOC': 'Biochemistry',
        'BIOL': 'Biology',
        'CHEM': 'Chemistry',
        'CHIN': 'Chinese',
        'CAMS': 'Cinema and Media Studies',
        'CLAS': 'Classics',
        'CGSC': 'Cognitive Science',
        'CS': 'Computer Science',
        'CCST': 'Cross-Culural Studies',
        'DANC': 'Dance',
        'DGAH': 'Digital Arts and Humanities',
        'ECON': 'Economics',
        'EDUC': 'Educational Studies',
        'ENGL': 'English',
        'ENTS': 'Environmental Studies',
        'EUST': 'European Studies',
        'FREN': 'French and Francophone Studies',
        'GWSS': 'Gender, Women\'s and Sextuality Studies',
        'GEOL': 'Geology',
        'GERM': 'German',
        'GRK': 'Greek',
        'HEBR': 'Hebrew',
        'HIST': 'History',
        'IDSC': 'Interdisciplinary Studies',
        'JAPN': 'Japanese',
        'LATN': 'Latin',
        'LTAM': 'Latin American Studies',
        'LING': 'Linguistics',
        'MATH': 'Mathetmatics',
        'STAT': 'Statistics',
        'MEST': 'Middle East Studies',
        'MELA': 'Middle Eastern Languages',
        'NEUR': 'Neuroscience',
        'PHIL': 'Philosophy',
        'PHYS': 'Physics',
        'POSC': 'Political Science',
        'PSYC': 'Psychology',
        'RELF': 'Religion',
        'RUSS': 'Russian',
        'SOAN': 'Sociology and Anthropology',
        'ARTS': 'Studio Arts',
        'SPAN': 'Spanish',
        'THEA': 'Theater and Dance',
      };
    
    try {
        const search = req.params.search.toLowerCase();
        const searchTerms = [];

        for (const [acronym, fullName] of Object.entries(departmentMap)) {
            if (acronym.toLowerCase().includes(search)) {
                searchTerms.push(`%${acronym.toLowerCase()}%`);
            }
            if (fullName.toLowerCase().includes(search)) {
                searchTerms.push(`%${fullName.toLowerCase()}%`);
            }
        }

        const query = `
            SELECT * FROM courses 
            WHERE 
                LOWER(section_listings) LIKE ANY($1) OR
                LOWER(description) LIKE ANY($1)`;

        const result = await pool.query(query, [searchTerms]);

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
