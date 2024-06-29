import express from 'express';

const app = express();
import dotenv from 'dotenv';
dotenv.config();

app.get('/', (req, res) => {
  res.send('Welcome to Test Secure api services');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server running 🚀 on port: ${PORT}`);
});
