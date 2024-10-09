import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Correct the path to a proper SQLite database file
export async function getDbConnection() {
    return open({
        filename: './public/data/database.db',  // Change this to a database file, not a JS file
        driver: sqlite3.Database
    });
}


// Function to set up the database and ensure tables exist
export async function setupDatabase() {
    const db = await getDbConnection();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS meeting (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT,
            mandatory INTEGER,
            dateTime TEXT,
            location TEXT,
            parking TEXT
        );
    `);
    console.log("Database setup complete");
}

// Example meeting data
let meeting = [
    {
        id: 0,
        topic: "CIT Monthly Meeting",
        mandatory: true,
        dateTime: "September 19th 2024, 2pm-3pm",
        location: "KNOY Hall West Lafayette",
        parking: "Park in the West Street Garage, 3rd floor, Venue opposite front entrance.",
    },
    {
        id: 1,
        topic: "Research in Higher level Ed",
        mandatory: false,
        dateTime: "September 24th 2024, 1pm-5pm",
        location: "Beresford Building, Room 2, Hall West Lafayette",
        parking: "Park in surface lot 300. Venue beside lot.",
    },
    {
        id: 2,
        topic: "Curriculum Planning",
        mandatory: true,
        dateTime: "October 19th 2024, 4pm-6pm",
        location: "IO240, Indianapolis",
        parking: "Park in North Street Garage, Michigan St. Venue opposite side of street, 300km North.",
    },
];

// Export the meeting data
export default meeting;
