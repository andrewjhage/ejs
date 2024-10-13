
import express from 'express'; //Bring in express, import (ES6)
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import meeting from './public/data/data.js';
import { getDbConnection, setupDatabase } from './public/data/data.js';  // Import the function, not the database file


const app = express();         //Create an instance of Express
const port = 3000;             // Use port 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + "/public"));
app.use(express.json());   // Middleware to pase JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up the database
setupDatabase().catch(console.error);
//Set the view engine with app.set,
//Express loads the module internally and stores it in app reference
app.set('view engine', 'ejs')

// Set the landing page route
// Send the index.ejs file in the pages folder, to client
// File will have an extension of .ejs, Embedded JavaScript
app.get('/', (req, res) => {
    res.render('pages/index', {data : meeting, title: "Schedule Meeting"});
});
app.get("/admin", async (req, res) => {
    try {
        const db = await getDbConnection();
        const rows = await db.all('SELECT * FROM meeting');
        res.render("pages/admin", { data: rows, title: "Administer Meeting", notification: true, message: "--------" });
    }
    catch (err) {
        console.error(err);
        res.status(404).send('An error occurred while getting the data to manage');
    }
    });
    
app.get('/contact', (req, res) => {
    res.render('pages/contact', {data : meeting, title: "Contact Us"});
});

// Edit route
app.get('/edit/:id', async (req, res) => {
        const db = await getDbConnection();
        const sql = `SELECT * FROM meeting WHERE id = ?`;
        const row = await db.get(sql, req.params.id);
        res.render('pages/edit', { data: row, title: "Change Meeting", notification: true, message: "Meeting being modified" });
});
    

app.post('/add_meeting', async (req, res) => {
        const { topic, mandatory, dateTime, location, parking } = req.body;
        let is_mandatory = req.body.mandatory ? 1 : 0;
        try {
            const db = await getDbConnection();
            await db.run('INSERT INTO meeting (topic, mandatory, dateTime, location, parking) VALUES (?, ?, ?, ?, ?)', [topic, is_mandatory, dateTime, location, parking]);
    res.redirect('/'); // Redirect back to home route
    } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while submitting the form');
    }
});

app.post('/edit/:id', async (req, res) => {
        const db = await getDbConnection();
        let { topic, mandatory, datetime, location, parking } = req.body;
        let is_mandatory = mandatory == undefined ? 0 : 1;
        const sql = `UPDATE meeting SET topic = ?, mandatory = ?, dateTime = ?, location = ?, parking = ? WHERE id = ?`;
        await db.run(sql, [topic, is_mandatory, datetime, location, parking, req.params.id]);
        res.redirect('/'); // Redirect back to home route
});


app.delete('/delete/:id', async (req, res) => {
    try {
        const db = await getDbConnection();
        await db.run('DELETE FROM meeting WHERE id = ?', req.params.id);
        res.redirect('/'); // Redirect back to home route
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting item');
    }
});
    
//Listen for requests
app.listen(port, () => {
    console.log(`App listening at port ${port}`)
});