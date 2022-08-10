const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//Midddle Ware
app.use(cors());
app.use(express.json());

//MongoDB Connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqv7isf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const languageCollection = client.db("courses").collection("language");
        const admissionCollection = client.db("courses").collection("admission");
        const jobCollection = client.db("courses").collection("job");
        const playCollection = client.db("Videos").collection("courseplaylist");

        //JWT Implementation Start
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     // console.log(user);
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     });
        //     res.send({ accessToken });
        // })

        //JWT Implementation End

        // courses -Start
        app.get("/language", async (req, res) => {
            const query = {};
            const cursor = languageCollection.find(query);
            const courses = await cursor.toArray();
            res.send(courses);
        });
        app.get("/admission", async (req, res) => {
            const query = {};
            const cursor = admissionCollection.find(query);
            const courses = await cursor.toArray();
            res.send(courses);
        });
        app.get("/job", async (req, res) => {
            const query = {};
            const cursor = jobCollection.find(query);
            const courses = await cursor.toArray();
            res.send(courses);
        });
        // courses -End
        app.get("/videos", async (req, res) => {
            const query = {};
            const cursor = playCollection.find(query);
            const videos = await cursor.toArray();
            res.send(videos);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Webb-School website!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
