import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/database.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
});
