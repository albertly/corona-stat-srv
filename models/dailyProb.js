const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const dailyProbSchema = new Schema({  
  date: Date,
  probeTime: String,
  newCases: String,
});


// Create the model class
const ModelClass = mongoose.model('dailyProb', dailyProbSchema);

// Export the model
module.exports = ModelClass;
