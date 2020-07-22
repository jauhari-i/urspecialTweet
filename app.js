const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
var http = require("http").Server(app);
const tw = require("node-tweet-stream");
const io = require("socket.io")(http, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.get("/", (req, res) => res.send("Hello World!"));

t = new tw({
  consumer_key: process.env.TWEET_APIKEY,
  consumer_secret: process.env.TWEET_APITOKEN,
  token: process.env.TWEET_CKEY,
  token_secret: process.env.TWEET_CTOKEN,
});

t.on("error", function (err) {
  console.log("Oh no");
});

t.track("quotes");
t.track("onedirection");
t.track("bucin");
t.track("zonanyaman");
t.track("kamukuat");

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    t.on("tweet", function (tweet) {
      socket.emit("tweet", tweet);
    });
  }, 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
