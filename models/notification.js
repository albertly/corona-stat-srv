const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const notificationSchema = new Schema({
  uid: String,
  endpoint: String,
  expirationTime: Date,
  keys: {
    p256dh: String,
    auth: String,
  },
  countries: [String],
});

// Create the model class
const ModelClass = mongoose.model('notification', notificationSchema);

// Export the model
module.exports = ModelClass;
