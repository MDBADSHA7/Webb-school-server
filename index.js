const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

//MongoDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.juxo7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('MongoDB connected')
    // perform actions on the collection object
    client.close();
});

app.get('/', (req, res) => {
    res.send('Webb School website!')
})
app.listen(port, () => {
    console.log(`Hello everyone ${port}`)
})