import dotenv from 'dotenv';
import express from 'express';
import { Sequelize } from 'sequelize';
import authRoutes from './routes/auth.js';
import cors from 'cors';

dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  


app.use(express.json()); // مهم جدًا لقراءة JSON اللي جاي من Postman
app.use('/api', authRoutes); // هنا بتربطي كل الراوتس اللي في auth.js بـ /api

// 1. تهيئة Sequelize
const sequelize = new Sequelize('credex', 'root', 'sql123$', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log // لمشاهدة استعلامات SQL
});


// 3. مزامنة الجداول
sequelize.sync({ force: true })
  .then(() => {
    console.log('✅ successful sync');
    

  })

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});