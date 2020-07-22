const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const tw = require("node-tweet-stream");
const io = require("socket.io")(http);
const cors = require("cors")
require("dotenv").config();

var http = require("http").createServer(app);

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
t.on("tweet", function (tweet) {
  io.emit("tweet", tweet);
});

app.get("/", (req, res) => res.send("Hello World!"));

http.use(cors());
http.listen(port, () => {
  console.log("listening on *:" + port);
});
