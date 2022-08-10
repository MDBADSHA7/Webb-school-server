const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//Midddle Ware
app.use(cors());
app.use(express.json());

//MongoDB Connected
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
        const webBlogsCollection = client.db('webBlogs').collection('blogs'); //blogs for this
        //Acadamic Bookstore for this code ..
        const AcadamicBookCollection = client.db('Bookstore').collection('AcadamicBook');
        //Skill Bookstore for this code...
        const SkillBooksCollection = client.db('Bookstore').collection('SkillBooks');

        //===============blogs for this code started-========
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = webBlogsCollection.find(query);
            const blog = await cursor.toArray();
            res.send(blog);
        });
        //===============blogs for this code Ends here-========


        //===============Bookstore/AcadamicBooks for this code started-========
        app.get('/AcadamicBook', async (req, res) => {
            const query = {};
            const cursor = AcadamicBookCollection.find(query);
            const AcadamicBook = await cursor.toArray();
            res.send(AcadamicBook);
        });
        //===============Bookstore/AcadamicBooks for this code end========

        //===============Bookstore/SkillBooksfor this code started-========
        app.get('/SkillBooks', async (req, res) => {
            const query = {};
            const cursor = SkillBooksCollection.find(query);
            const SkillBooks = await cursor.toArray();
            res.send(SkillBooks);
        })
        //===============Bookstore/SkillBooks for this code end========


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

    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
<<<<<<< HEAD
    res.send('Webb School......')
=======
    res.send('Hello World!')
>>>>>>> 107bfbb0cbe42b4561dde1bb82f0a14f7cd2c5ae
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
