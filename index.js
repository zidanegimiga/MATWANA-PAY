require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))
const connectDB = require('./config/dbConnect')

// connect to database
connectDB();

const app = express();

app.get('/', (req, res) =>{
  res.send('Project initiated')
})

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