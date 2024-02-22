require('./database/connect');
// this is for seeding location data to database on first launch
// require("./seed");
const cloudinary  = require("cloudinary");
const { config } = require('./config/global.config');
const express = require('express');
const http = require("http");
const { initExpress } = require("./app"); 

const app = express();
initExpress({ app });

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret
});

const server = http.createServer(app)
  .listen(config.port, () => {
    console.log(`✅ Server listening on port: ${config.port}`);
  })
  .on('error', (err) => {
    console.log(err);
    process.exit(1);
  });