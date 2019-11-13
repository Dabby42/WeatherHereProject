var mongoose = require("mongoose");

var infoSchema = new mongoose.Schema({
  lat: String,
  long: String,
  weather: Object,
  air: Object
})

module.exports = mongoose.model("Weather_Info", infoSchema);
