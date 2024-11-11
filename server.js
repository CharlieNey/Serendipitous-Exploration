const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/homepage.html'));
  });

app.listen(PORT, () => {
console.log("Server is running at http://localhost:${PORT}");
});