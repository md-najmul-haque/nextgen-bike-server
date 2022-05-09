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
        const query = {};

        const cursor = productCollection.find(query);
        const result = await cursor.toArray()

        app.get('/inventory', (req, res) => {
            res.send(result);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.send(product);
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