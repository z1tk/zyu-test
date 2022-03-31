const express = require('express');
const app = express();
const url = require('url');

const fetch = require('node-fetch');
const youtubedl = require('youtube-dl-exec')

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: __dirname});
});

function registerFile(file) {
  app.get(`/${file}`, (req, res) => {
    req.sendFile(file)
  });
}

// Youtube
app.get('/youtube/video', async (req, res) => {
  let params = url.parse(req.url, true).query;
  if (params.id == undefined) {
    res.sendStatus(400);
    return;
  }

  let videoLink = `https://www.youtube.com/watch?v=${params.id}`;
  youtubedl(videoLink, {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    referer: 'https://example.com'
  })
  .then(output => {
    res.status(200).json(output)
  })
  .catch(e => res.sendStatus(404))
});

app.get('/youtube/player', async (req, res) => {
  let params = url.parse(req.url, true).query;
  if (params.id == undefined) {
    res.redirect(302, "home");
    return;
  }

  var urlTest = /www\.youtube\.com\/watch\?v=[a-z--_]+/;
  if (urlTest.test(params.id)) {
    let id = params.id.split('=');
    res.redirect(301, "/youtube/player?id=" + id[1]);
    return;
  }

  res.sendFile("youtube/youtube-player.html", {root: __dirname});
});
app.get('/youtube/home', async (req, res) => {
  res.sendFile("youtube/home.html", {root: __dirname});
});
app.get('/youtube', async (req, res) => {
  res.redirect(302, "/youtube/home");
});

app.get('/youtube/plyr/plyr.js', async (req, res) => {
  res.type('js').sendFile("youtube/plyr/plyr.js", {root: __dirname});
});
app.get('/youtube/plyr/plyr.css', async (req, res) => {
  res.type('css').sendFile("youtube/plyr/plyr.css", {root: __dirname});
});
app.get('/youtube/plyr/blank.mp4', async (req, res) => {
  res.type('mp4').sendFile("youtube/plyr/blank.mp4", {root: __dirname});
});
app.get('/youtube/plyr/plyr.svg', async (req, res) => {
  res.type('svg').sendFile("youtube/plyr/plyr.svg", {root: __dirname});
});

// Reddit
app.get('/reddit/home', async (req, res) => {
  res.sendFile("reddit/subviewer.html", {root: __dirname});
});
app.get('/reddit', async (req, res) => {
  res.redirect(302, "/reddit/home");
});

app.listen(3000, () => {
  console.log('server started');
});