const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;
//Midddle War
app.use(cors());
app.use(express.json());

//MongoDB Connected
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-3lraqhp-shard-00-00.lqv7isf.mongodb.net:27017,ac-3lraqhp-shard-00-01.lqv7isf.mongodb.net:27017,ac-3lraqhp-shard-00-02.lqv7isf.mongodb.net:27017/?ssl=true&replicaSet=atlas-rwv3eh-shard-0&authSource=admin&retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyAccess = (req, res, next) => {
  const authorizationToken = req.headers.authorization;
  if (!authorizationToken) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authorizationToken.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const languageCollection = client.db("courses").collection("language");
    const admissionCollection = client.db("courses").collection("admission");
    const jobCollection = client.db("courses").collection("job");
    const paidCourseCollection = client.db("courses").collection("paidcourse");
    const playCollection = client.db("Videos").collection("courseplaylist");
    const usersCollection = client.db("users").collection("user");
    const messageCollection = client.db("messages").collection("message");
    const orderCollection = client.db("Orders").collection("order");
    const webBlogsCollection = client.db("webBlogs").collection("blogs");
    const LiveCollection = client.db("Live").collection("lives");
    const LiveDataCollection = client.db('Live').collection('liveData');


    //Acadamic Bookstore for this code ..
    const AcadamicBookCollection = client
      .db("Bookstore")
      .collection("AcadamicBook");
    //Skill Bookstore for this code...
    const SkillBooksCollection = client
      .db("Bookstore")
      .collection("SkillBooks");

    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email;
      const requesterAccount = await usersCollection.findOne({ email: requester });
      if (requesterAccount.role === 'admin') {
        next();
      }
      else {
        res.status(403).send({ message: 'forbidden' });
      }
    }

    //===============blogs for this code started-========
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = webBlogsCollection.find(query);
      const blog = await cursor.toArray();
      res.send(blog);
    });
    app.post("/blogs", async (req, res) => {
      const addblogs = req.body;
      const result = await webBlogsCollection.insertOne(addblogs);
      res.send(result);
    });

    //===============blogs for this code Ends here-========

    //===============Bookstore/AcadamicBooks for this code started-========
    app.get("/AcadamicBook", async (req, res) => {
      const query = {};
      const cursor = AcadamicBookCollection.find(query);
      const AcadamicBook = await cursor.toArray();
      res.send(AcadamicBook);
    });

    app.post("/AcadamicBook", async (req, res) => {
      const addblogs = req.body;
      const result = await AcadamicBookCollection.insertOne(addblogs);
      res.send(result);
    });
    //===============Bookstore/AcadamicBooks for this code end========

    //===============Bookstore/SkillBooksfor this code started-========
    app.get("/SkillBooks", async (req, res) => {
      const query = {};
      const cursor = SkillBooksCollection.find(query);
      const SkillBooks = await cursor.toArray();
      res.send(SkillBooks);
    });
    //===============Bookstore/SkillBooks for this code end========

    app.put("/user", async (req, res) => {
      const { email, name } = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: name,
          email: email,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
      res.send({ success: true, result, token });
    });
    app.get("/user", verifyAccess, async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    });
    app.get("/user/:id", verifyAccess, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const courses = await usersCollection.findOne(query);
      res.send(courses);
    });
    
    app.delete("/user/:id", verifyAccess, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/user-role", verifyAccess, verifyAdmin, async (req, res) => {
      const { id } = req.query;
      const { role } = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: role,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ success: true, result });
    });

    app.get("/user-role", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.put("/update-user", verifyAccess, async (req, res) => {
      const { qEmail } = req.query;
      const { gender, phone, address, facebookLink, instaLink, linkedInLink, education, image, name, coverPhoto, profession, bio } =
        req.body;
      const filter = { email: qEmail };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          gender: gender,
          phone: phone,
          address: address,
          linkedInLink: linkedInLink,
          facebookLink: facebookLink,
          instaLink: instaLink,
          education: education,
          coverPhoto: coverPhoto,
          profession: profession,
          image: image,
          name: name,
          bio: bio,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send({ success: true, result });
    });

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

    // chat 
    io.on("connection", (socket) => {
      socket.on("chat", (payload) => {
        io.emit("chat", payload)
      });
    });




    app.get("/job", async (req, res) => {
      const query = {};
      const cursor = jobCollection.find(query);
      const courses = await cursor.toArray();
      res.send(courses);
    })
    app.get("/mycourse", verifyAccess, async (req, res) => {
      const { email } = req.query;
      const courses = await paidCourseCollection.find({ userEmail: email }).toArray();
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
    app.get("/language/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const courses = await languageCollection.findOne(query);
      res.send(courses);
    });
    // delete language courses
    app.delete("/language/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await languageCollection.deleteOne(query);
      res.send(result);
    });
    // get amission id
    app.get("/admission/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const courses = await admissionCollection.findOne(query);
      res.send(courses);
    });
    // delete admission courses
    app.delete("/admission/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await admissionCollection.deleteOne(query);
      res.send(result);
    });
    // get job id
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const courses = await jobCollection.findOne(query);
      res.send(courses);
    });
    // delete job courses
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    // post language course
    app.post("/language", async (req, res) => {
      const addlanguage = req.body;
      const result = await languageCollection.insertOne(addlanguage);
      res.send(result);
    });
    // post job course
    app.post("/job", async (req, res) => {
      const addjob = req.body;
      const result = await jobCollection.insertOne(addjob);
      res.send(result);
    });
    // post admission course
    app.post("/admission", async (req, res) => {
      const addadmission = req.body;
      const result = await admissionCollection.insertOne(addadmission);
      res.send(result);
    });
    // post paid course 
    app.post("/mycourse", async (req, res) => {
      const addadmission = req.body;
      const result = await paidCourseCollection.insertOne(addadmission);
      res.send(result);
    });

    // message 
    app.post("/message", verifyAccess, verifyAdmin, async (req, res) => {
      const addlanguage = req.body;
      const result = await messageCollection.insertOne(addlanguage);
      res.send(result);
    });
    app.get("/message", verifyAccess, async (req, res) => {
      const query = {};
      const cursor = messageCollection.find(query);
      const message = await cursor.toArray();
      res.send(message);
    });
    app.delete("/message/:id", verifyAccess, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await messageCollection.deleteOne(query);
      res.send(result);
    });
    /* lIve Class  */
    /* lIve Class ------------------  */
    app.get('/LiveData', async (req, res) => {
      const query = {};
      const cursor = LiveDataCollection.find(query);
      const lives = await cursor.toArray();
      res.send(lives);
    });
    app.post('/lives', async (req, res) => {
      const addLive = req.body;
      const result = await LiveCollection.insertOne(addLive);
      res.send(result);
    })
    app.get('/Lives', async (req, res) => {
      const query = {};
      const cursor = LiveCollection.find(query);
      const live = await cursor.toArray();
      res.send(live);
    });
   
    app.delete('/Lives/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await LiveCollection.deleteOne(query)
      res.send(result);
    });
    app.post("/order", verifyAccess, async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send({ success: true, result });
    });
    app.get("/order", verifyAccess, async (req, res) => {
      const { email } = req.query;
      const orders = await orderCollection.find({ userEmail: email }).toArray();
      res.send(orders);
    });
    app.put("/order", verifyAccess, async (req, res) => {
      const { orderId, transactionId } = req.body;
      const filter = { _id: ObjectId(orderId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          transactionId: transactionId,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ success: true, result });
    });
    app.get("/order/:uname", verifyAccess, async (req, res) => {
      const { uname } = req.params;
      const order = await orderCollection.findOne({ uname: uname });
      res.send(order);
    });
    app.delete("/order", verifyAccess, async (req, res) => {
      const { id } = req.query;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/all-order", verifyAccess, verifyAdmin, async (req, res) => {
      const orders = await orderCollection.find({}).toArray();
      res.send(orders);
    });
    app.post("/create-payment-intent", verifyAccess, async (req, res) => {
      const { totalAmount } = req.body;
      const amount = totalAmount * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Webb School..");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
