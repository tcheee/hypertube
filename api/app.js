const express = require('express')
const cors = require('cors');
const router = require('./routers/router');

const app = express()
const port = (process.env.PORT || 5000)
const httpServer = require("http").createServer(app);

app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000' || "https://matcha-heroku.herokuapp.com/"}));
app.use(router);

// Connecting the server to the port

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});