const express = require('express')
const cors = require('cors');
const movieInfoRouter = require('./routes/movieInfo')
const userRouter = require('./routes/user');
const streamingRouter = require('./routes/movieStreaming');
const subtitlesRouter = require('./routes/subtitles');
const commentRouter = require('./routes/comment');
const movieRouter = require('./routes/movie');
const scheduleDeletion = require('./subscribers/cronDeleteMovie')

//Define const variable that are going to be used below
const app = express()
const port = (process.env.PORT || 5000)
const httpServer = require("http").createServer(app);

//Apply several middleware to work with the client
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(cors({credentials: true, origin: 'http://localhost:3000' || ""}));

//Getting the routes from the different routers
app.use(userRouter);
app.use(movieRouter);
app.use(movieInfoRouter);
app.use(commentRouter);
app.use(streamingRouter);
app.use(subtitlesRouter);

scheduleDeletion();

// Connecting the server to the port
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});