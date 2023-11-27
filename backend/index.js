import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { errorHandler } from './middlewares/erroHandler.js'
import { dbConnection } from './db/dbConnection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { v2 as cloudinary } from 'cloudinary'
//import { corsOptions } from './config/corsOptions.js';
//routes
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import path from 'path';

const __dirname = path.resolve();

const PORT = process.env.PORT || 3030





const app = express();
app.use(cookieParser())

//middlewares
app.use(express.json({ limit: '50mb' })) //to parse JSON data in req.body
app.use(express.urlencoded({ extended: true })) //to parse JSON data in req.body
app.use(cors())
app.use(morgan('common'))


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes) 

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})


//error handler
app.use(errorHandler)

dbConnection();

app.listen(PORT, () => console.log('App listening at Port', PORT))