import express from 'express';
import dotenv from 'dotenv';
import connectToDb from './config/db.js';
import otpRoutes from './routes/otpRoutes.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const app = express();

connectToDb();

app.use(express.json());
app.use('/api/otp', otpRoutes);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Test Secure API services');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running 🚀 on port: ${PORT}`);
});
