import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors'
import authRoutes from './routes/authRoute';
import challengeRouts from './routes/challangeRoute'
import progressRoutes from './routes/progressRoute'
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// connect to db
connectDB(); 

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Daily Challenge Tracker API is running!');
});

app.use('/api/auth',authRoutes);
app.use('/api/challange',challengeRouts);
app.use('/api/progress',progressRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});