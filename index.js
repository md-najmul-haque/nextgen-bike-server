const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.zlw1e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("bicycleWarehouse").collection("product");

        // Load all Product
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        });

        //Load single product data
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        //api for delivered and update button for updating quantity purpose.
        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStock = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: updatedStock.quantity,
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    }
    finally {

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Bicycle warehouse is running')
});

app.listen(port, () => {
    console.log('port is listening', port)
})