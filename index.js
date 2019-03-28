const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Finstagram app');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server start on port: ${port}`);
});
