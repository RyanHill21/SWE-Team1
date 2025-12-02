require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const courseRouter = require('./routes/courses');
const sessionRouter = require('./routes/sessions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRouter);
app.use('/api/sessions', sessionRouter);

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Mongo connected'))
.catch(err=> console.error(err));

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log('Server running on', port));