import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Node, Express, and MongoDB!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
