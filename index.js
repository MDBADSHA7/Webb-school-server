const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//Midddle Ware
app.use(cors());
app.use(express.json());

//MongoDB Connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqv7isf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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
    // get language id 
    app.get('/language/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const courses = await languageCollection.findOne(query);
      res.send(courses);
  });
  // delete language courses 
  app.delete('/language/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await languageCollection.deleteOne(query);
    res.send(result);
});
  }
  finally{

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
