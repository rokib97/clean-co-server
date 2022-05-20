const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.errmo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db("CleanCo").collection("service");

    // get all data from database api
    app.get("/get-service", async (req, res) => {
      const services = await serviceCollection.find({}).toArray();
      res.send(services);
    });
    // create data in database api // add service
    // with try catch
    // app.post("/add-service", async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const result = await serviceCollection.insertOne(data);
    //     res.send({ status: true, result: result });
    //   } catch (error) {
    //     res.send({ status: false, error });
    //   }
    // });
    // without try catch
    app.post("/add-service", async (req, res) => {
      const data = req.body;
      const result = await serviceCollection.insertOne(data);
      res.send(result);
    });
    // update service
    app.put("/update-service/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await serviceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // delete a service api
    app.delete("/delete-service/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// body
app.get("/user2", async (req, res) => {
  const data = req.body;
  res.send(data);
});

// query
app.get("/user", async (req, res) => {
  const { name, age } = req.query;

  res.send({ name, age });
});

// param
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(id);
});

app.get("/", async (req, res) => {
  res.send("Hello from Clean and Co");
});

app.listen(port, () => {
  console.log(`Clean & Co server is running from port ${port} `);
});
