const express = require('express');
const app = express();
const {Dragon} = require('./db');

const port = 3000;

app.get('/', async (req, res) => {
  const ds = await Dragon.findAll();
  res.send(ds);
});

app.get('/:tokenId', async (req, res) => {
  let dra = await Dragon.findOne({where: {tokenId: req.params["tokenId"]}});
  res.send(dra);
});

app.listen(port, () => {
  console.log(`go to http://localhost:${port}`);
});
