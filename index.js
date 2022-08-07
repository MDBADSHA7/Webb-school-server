const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//Midddle Ware
app.use(cors());
app.use(express.json());

//MongoDB Connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqv7isf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const webBlogsCollection = client.db('webBlogs').collection('blogs');


        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = webBlogsCollection.find(query);
            const blog = await cursor.toArray();
            res.send(blog);
        });


    }
    finally {


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Webb School website !!!!!!!')
})
app.listen(port, () => {
    console.log(`Hello everyone ${port}`)
})