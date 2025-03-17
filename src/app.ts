import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes';
import fontRoutes from './routes/fontRoutes';
import screenRoutes from './routes/screenRoutes';
import signupScreenRoutes from './routes/signupScreenRoutes';
import forgetPwScreenRoutes from './routes/forgetPwScreenRoutes';
import checkInScreenRoutes from './routes/checkInScreenRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);
app.use('/api/fonts', fontRoutes);
app.use('/api/screen', screenRoutes);
app.use('/api/signupscreen', signupScreenRoutes);
app.use('/api/forgetPwscreen', forgetPwScreenRoutes);
app.use('/api/checkinscreen', checkInScreenRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});