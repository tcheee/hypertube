const express = require('express')
const cors = require('cors');
const movieInfoRouter = require('./routes/movieInfo')
const userRouter = require('./routes/user');
const streamingRouter = require('./routes/movieStreaming');
const subtitlesRouter = require('./routes/subtitles');
const commentRouter = require('./routes/comment');

//Define const variable that are going to be used below
const app = express()
const port = (process.env.PORT || 5000)
const httpServer = require("http").createServer(app);

//Apply several middleware to work with the client
app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000' || ""}));

//Getting the routes from the different routers
app.use(userRouter);
app.use(movieInfoRouter);
app.use(commentRouter);
app.use(streamingRouter);
app.use(subtitlesRouter);

// Connecting the server to the port
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});