const http = require('http');
const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const port = 8080;

app.use(express.json())
app.use(cookieParser())

app.get('/login', (req, res) => {
  console.log('test');
})

app.post('/login/:name', (req, res, next) => {
  let {name} = req.params;
  var cookieOpt = {
    maxAge: 5000,
    httpOnly: true,
    sameSite: 'strict',
  };
  res.cookie('name', name, cookieOpt);
  res.status(200).send();

})

app.get('/hello', (req, res) => {
  let name = res.cookie.name;

  res.send(`Hello ${name}`);
})
app.listen(port, () => {
  console.log("Listening");
})
