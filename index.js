// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { initializeApp } = require("firebase/app");
const { getFirestore, getDoc, doc } = require('firebase/firestore/lite');

// defining the Express app
const app = express();
const PORT = process.env.PORT || 3002;


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "lens-garden.firebaseapp.com",
    projectId: "lens-garden",
    storageBucket: "lens-garden.appspot.com",
    messagingSenderId: "1045737166163",
    appId: "1:1045737166163:web:e2eeed7d4b84864084fda6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function getUser(db, address) {
    const docRef = doc(db, "users", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null
    }
}


// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.get("/", (req, res) => {
    res.send({ "name": "John" });
});

// defining an endpoint to return all ads
app.get('/:address', async (req, res) => {

    const { address } = req.params;

    try {
        const user = await getUser(db, address);
        if (user !== null) {
            let resObj = {
                attributes: user.attributes,
                image: user.image,
                name: user.name,
                description: user.description
            }
            res.json(resObj);
        } else {
            res.json({ error: "User not found in DB" });
        }
    } catch (error) {
        console.log("Error: ", error);
    }


});

// starting the server
app.listen(PORT, () => {
    console.log('listening...');
});