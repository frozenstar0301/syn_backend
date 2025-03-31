import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import imageRoutes from './routes/imageRoutes';
import fontRoutes from './routes/fontRoutes';
import screenRoutes from './routes/screenRoutes';
import signupScreenRoutes from './routes/signupScreenRoutes';
import forgetPwScreenRoutes from './routes/forgetPwScreenRoutes';
import checkInScreenRoutes from './routes/checkInScreenRoutes';
import userRoutes from './routes/userRoutes';
import firstloadRoutes from './routes/firstloadRoutes';
import synvaultRoutes from './routes/synvaultRoutes';
import syngamesRoutes from './routes/syngamesRoutes';
import joingameRoutes from './routes/joingameRoutes';
import joinsyngamepopupRoutes from './routes/joinsyngamepopupRoutes';
import syngamepopupRoutes from './routes/syngamepopupRoutes';
import rankuprewardsRoutes from './routes/rankuprewardsRoutes';
import rankuppercentageRoutes from './routes/rankuppercentageRoutes';
import topnavbarRoutes from './routes/topnavbarRoutes';
import playerprofileRoutes from './routes/playerprofileRoutes';
import changecharacterRoutes from './routes/changecharacterRoutes';
import leadershipboardRoutes from './routes/leadershipboardRoutes';
import linkemailRoutes from './routes/linkemailRoutes';
import inboxRoutes from './routes/inboxRoutes';
import dailyrewardRoutes from './routes/dailyrewardRoutes';
import seasonRoutes from './routes/seasonRoutes';
import earnsynpointRoutes from './routes/earnsynpointRoutes';
import historyRoutes from './routes/historyRoutes';
import changesettingRoutes from './routes/changesettingRoutes';
import bottomnavbarRoutes from './routes/bottomnavbarRoutes';



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
app.use('/api/firstloadscreen', firstloadRoutes);
app.use('/api/synvaultscreen', synvaultRoutes);
app.use('/api/syngamescreen', syngamesRoutes);
app.use('/api/joingamescreen', joingameRoutes);
app.use('/api/joinsyngamepopupscreen', joinsyngamepopupRoutes);
app.use('/api/syngamepopupscreen', syngamepopupRoutes);
app.use('/api/rankuprewardscreen', rankuprewardsRoutes);
app.use('/api/rankuppercentagescreen', rankuppercentageRoutes);
app.use('/api/topnavbarscreen', topnavbarRoutes);
app.use('/api/playerprofilescreen', playerprofileRoutes);
app.use('/api/changecharacterscreen', changecharacterRoutes);
app.use('/api/leadershipboardscreen', leadershipboardRoutes);
app.use('/api/linkemailscreen', linkemailRoutes);
app.use('/api/inboxscreen', inboxRoutes);
app.use('/api/dailyrewardscreen', dailyrewardRoutes);
app.use('/api/seasonscreen', seasonRoutes);
app.use('/api/earnsynpointscreen', earnsynpointRoutes);
app.use('/api/historyscreen', historyRoutes);
app.use('/api/changesettingscreen', changesettingRoutes);
app.use('/api/bottomnavbarscreen', bottomnavbarRoutes);

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});