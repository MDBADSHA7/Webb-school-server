const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
//Midddle Ware
app.use(cors());
app.use(express.json());

//MongoDB Connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqv7isf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        //Acadamic Bookstore for this
        const BookstoreCollection = client.db('Bookstore').collection('AcadamicBook');


        //===============Bookstore/AcadamicBooks for this code started-========
        app.get('/AcadamicBook', async (req, res) => {
            const query = {};
            const cursor = BookstoreCollection.find(query);
            const AcadamicBook = await cursor.toArray();
            res.send(AcadamicBook);
        });
        //===============Bookstore/AcadamicBooks for this code end========

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