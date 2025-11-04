import { exec } from 'child_process';

import express, { json } from "express";
import bodyParser from "body-parser";

import { autoLogin } from "./controller/newtemp.js";
import cors from 'cors';

const PORT = process.env.PORT || 80; // Force port 80 for production behind Cloudflare




const app = express()
app.use(express.json());// for parsing application/json
// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow requests from all origin
    credentials: false,// Allow credentials (cookies, authorization headers)
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
}));
app.options('*', cors()); // Handle preflight requests for all routes

app.get('/', async (req, res) => {
    console.log("working");

    res.set('content-type', 'application/json');
    res.status(200).json({ status: 200, server: "Runnnig" });

});


app.get('/devproductupdates', (req, res) => {
    res.set('content-type', 'application/json');
    // Get the current timestamp
    const timestamp = Date.now();

    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Format the date and time with time zone
    const options = {
        weekday: 'short', // "Fri"
        year: 'numeric', // "2017"
        month: 'short', // "Nov"
        day: 'numeric', // "17"
        hour: '2-digit', // "19"
        minute: '2-digit', // "15"
        second: '2-digit', // "15"
        timeZone: 'Asia/Kolkata', // Time zone for Kolkata
        timeZoneName: 'longOffset', // "GMT+05:30"
    };

    // Format the date and time
    const formattedDate = date.toLocaleString('en-IN', options);
    try {
        autoLogin();
        res.status(200).json({ status: 200, message: `Scrapping started at: ${formattedDate}` });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }

})



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);

})

