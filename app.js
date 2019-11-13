const express = require("express");
const app = express();
const fetch = require("node-fetch");
var  mongoose = require("mongoose");
const Weather_Info = require("./models/info");
require("dotenv").config();
const url = process.env.DATABASEURL || "mongodb://localhost/weatherProject"

app.use(express.json({limit: "1mb"}));

// setting up database
mongoose.connect(url, {useNewUrlParser:true})

app.get("/", (req, res) => {
  res.render("index.ejs");
})

app.post("/api", (req, res) => {
  console.log(req.body);
  const latitude = req.body.lat;
  const longitude = req.body.long;
  const weather = req.body.weather;
  const air = req.body.air;
  const results = {
    lat: latitude,
    long: longitude,
    weather: weather,
    air: air
  }
  Weather_Info.create(results, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.json(newlyCreated);
    }
  });
})

app.get("/allCheckins", (req, res) => {
  Weather_Info.find({}, (err, allCheckins) =>{
    if (err) {
      console.log(err);
    } else {
      console.log(allCheckins);
      res.json(allCheckins)
    }
  })
})

app.get("/weather/:latlon", async (req, res) => {
  console.log(req.params);
  const latlon = req.params.latlon.split(",");
  console.log(latlon);
  const lat = latlon[0];
  const long = latlon[1];
  console.log(lat, long);
  const api_key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${long}/?units=si`;
  // const apiUrl = "https://api.darksky.net/forecast/d837a2d43931037dd007076b4112610d/37.8267,-122.4233"
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${long}`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data ={
    weather: weather_data,
    air_quality: aq_data
  }
  res.json(data);
})

app.listen(3000, process.env.IP, () => {
  console.log("Server is listening!");
})
