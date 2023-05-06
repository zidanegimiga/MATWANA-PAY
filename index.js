const express = require('express');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))

const app = express();

app.get('/', (req, res) =>{
  res.send('Project initiated')
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});