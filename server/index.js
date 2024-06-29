import express from 'express';

const app = express();
import connectToDb from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();
<<<<<<< Updated upstream

=======
connectToDb();
// // connect to db
// connectToDb();

// //require routes
// const userRouter = require('./routes/userRouter');
// const otpRouter = require('./routes/otpRoutes');
// const placesRouter =require('./routes/placesRoutes');
// // requiring middlewares
// const errorMiddleware = require('./middleware/Error');

// initialize express
// app.use(express.json({ limit: '20mb' }));
// app.use(cookieParser());

// using routers
// app.use('/api/user', userRouter);
// app.use('/api/otp', otpRouter);
// app.use('/api/places',placesRouter);
//send hello on /
>>>>>>> Stashed changes
app.get('/', (req, res) => {
  res.send('Welcome to Test Secure api services');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server running 🚀 on port: ${PORT}`);
});
