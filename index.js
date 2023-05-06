require('dotenv').config()

const express = require('express');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnect')
const MongoStore = require("connect-mongo")
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500;

// connect to database
connectDB();

const app = express();

app.use(cors(corsOptions))

app.get('/', (req, res) =>{
  res.send('Project initiated')
})

app.use('/passenger/register', require('./routes/passengers/registerPassenger'))

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})