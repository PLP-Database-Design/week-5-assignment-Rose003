// // CREATE SERVER 
const http = require('http'); //imports the http module
const mysql = require('mysql2');
const express = require('express');

//Load environment variables
require('dotenv').config()

const app = express();

//Define the hostname and port
const hostname = '127.0.0.1'; //LocalHost
const port = 3000; //Port Number

//Set EJS as the view engine
app.set('view engine', 'ejs');

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Connect to MySQL
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  // app.get('/', (req, res) => {
  //   res.send('Welcome to the Patient Management System');
  // });
  

//   Create a ```GET``` endpoint that retrieves all patients and displays their:
app.get('/patients', (req, res) => {
  // SQL query to fetch all patients with required fields
  const query = `
    SELECT patient_id, first_name, last_name, date_of_birth 
    FROM patients
  `;

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // render the patients view with the results
    res.render('patients', { patients: results });
  });
});


// QUESTION TWO
// ## 2. Retrieve all providers
// Create a ```GET``` endpoint that displays all providers with their:
// - ```first_name```
// - ```last_name```
// - ```provider_specialty```

app.get('/providers', (req, res) => {
  // SQL query to fetch all providers with required fields
  const query = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers
  `;

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Render the providers view with the results
    res.render('providers', { providers: results });
  });
});


// QUESTION THREE
// ## 3. Filter patients by First Name
// Create a ```GET``` endpoint that retrieves all patients by their first name
app.get('/patients/FirstName', (req, res) => {
  const firstName = req.query.firstName;

  if (!firstName) {
    return res.status(400).render('error', { message: 'First name query parameter is required' });
  }

  // SQL query to fetch patients with the given first name
  const query = `
    SELECT patient_id, first_name, last_name, date_of_birth 
    FROM patients
    WHERE first_name LIKE ?
  `;

  // Execute the query
  connection.query(query, [`%${firstName}%`], (error, results) => {
    if (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Render the patients view with the filtered results
    res.render('patients', { patients: results, firstName: firstName });
  });
});

// QUESTION FOUR
// ## 4. Retrieve all providers by their specialty
// Create a ```GET``` endpoint that retrieves all providers by their specialty
app.get('/providers/Specialty', (req, res) => {
  const specialty = req.query.specialty;

  if (!specialty) {
    return res.status(400).render('error', { message: 'Specialty query parameter is required' });
  }

  // SQL query to fetch providers with the given specialty
  const query = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers
    WHERE provider_specialty LIKE ?
  `;

  // Execute the query
  connection.query(query, [`%${specialty}%`], (error, results) => {
    if (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Render the providers view with the filtered results
    res.render('providers', { providers: results, specialty: specialty });
  });
});

 // Make the server listen on the specified port
 app.listen(port, hostname, () => {
     console.log(`Server running at http://${hostname}:${port}/`);
 });



