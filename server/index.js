const express = require('express');
const dbConnect = require('./dbConnect');
const dotenv = require('dotenv');
const authRouter = require('./routers/authRouter');
const morgan = require('morgan');
const postsRouter = require('../server/routers/postsRouter');
const userRouter = require('../server/routers/userRouter');
const cookieParser = require('cookie-parser');
//the above cookie-parser is used for saving data in cookies
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

dotenv.config('./.env');
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();

//middlewares
app.use(express.json({limit: '10mb'}));
app.use(morgan('common'));
app.use(cookieParser());//adding cookie in middleware
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))

app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.get('/', (req,res) => {
    res.status(200).send('ok from server');
})

const PORT = process.env.PORT;
dbConnect();
app.listen(PORT, ()=>{
    console.log(`Listening on PORT:${PORT} `);
});