const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors')
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.70s8n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
      
      //get all services API
      app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
      })

      //get single service API
      app.get('/service/:id', async (req, res) => {
        const id = req.params.id  
        console.log('getting specific service', id)
        const query = { _id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
        console.log(service);

      })

      //Post API
      app.post('/services', async (req, res) => {
        const service = req.body;  
        console.log('hit the post api', service)  
        // res.json('post hitted')
        
          const result = await servicesCollection.insertOne(service);
          console.log(result);
          res.json(result);
      });

      //Delete Service API
      app.delete('/service/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id)};
          const result = await servicesCollection.deleteOne(query);
          res.json(result);
      })

      //Update Service API
      app.put('/service/:id', async (req, res) => {
          const id = req.params.id;
          const updatedService = req.body;
          console.log('hitting put', id,)
          const filter = { _id: ObjectId(id)};
          const options = { upsert: true }
          const updateService = {
              $set: {
                  name: updatedService.name,
                  description: updatedService.description,
                  img: updatedService.img,
                  price: updatedService.price
              }
          }

          const result = await servicesCollection.updateOne(filter, updateService, options);
          res.json(result);
      })

    } 
    finally {
    //   await client.close();
    }
  }

  run().catch(console.dir);

app.get('/', (req, res) => {
res.send('Hello from node server',)
})


app.listen(port, () => {
console.log('listening to port', port);
})