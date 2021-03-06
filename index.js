const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// use middlewire 
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

//username: dbuser1

// password: kvkfMLezlTvyNHhi

//from mongodb
var uri = "mongodb://dbuser1:kvkfMLezlTvyNHhi@cluster0-shard-00-00.cyc0z.mongodb.net:27017,cluster0-shard-00-01.cyc0z.mongodb.net:27017,cluster0-shard-00-02.cyc0z.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-dupsah-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');
        // const user = { name: "bodi Mahi", email: "mahi@gmail.com" };
        // const result = await userCollection.insertOne(user);
        // console.log(`user inserted with id:${result.insertedId}`);

        //GET user: show all the users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // POST User:add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        //delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        //GET user: show a single user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        //update a single user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        })



    } finally {
        // await client.close();
    }

}



run().catch(console.dir);

// client.connect(err => {
//     const collection = client.db("foodExpress").collection("users");
//     console.log('db connected');
//     // perform actions on the collection object
//     client.close();
// });



app.get('/', (req, res) => {
    res.send('Running my node crud server')
});

app.listen(port, () => {
    console.log("CRUD server is running");
})

