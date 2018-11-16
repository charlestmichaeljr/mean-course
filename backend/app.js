const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://charlie:' + process.env.MONGO_ATLAS_PASSWORD +'@cluster0-18tz9.mongodb.net/node-angular')
  .then(()=>{console.log('Connected to the database')})
  .catch(()=>{console.log('Error connecting to the database')})
// Password is o5jMlvsgJiETbw8B

// use the body parser package to parse Http Request Bodies
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images',express.static(path.join('backend/images')));

app.use((req,resp,next)=>{
  resp.setHeader('Access-Control-Allow-Origin','*');
  resp.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  resp.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
});

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes)

// export the app to be used by node js
module.exports = app;
