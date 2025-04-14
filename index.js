const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
  res.send(`Hello from Node.js! Environment: ${NODE_ENV}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
