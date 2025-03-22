// backend/server.cjs
import express from 'express';
// const express = require('express');
// const cors = require('cors');
// const { MongoClient } = require('mongodb');
import cors from 'cors';
import { MongoClient } from 'mongodb';
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

const Db = "";
const client = new MongoClient(Db, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error(err);
  }

  const db = client.db('traffic_buddy');
  const collection = db.collection('Traffic_Buddy');

  app.get('/data', async (req, res) => {
    try {
      const data = await collection.find({}).toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});

