const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const notificationSchema = new Schema({  
    endpoint: String,
    expirationTime: Date,
    keys: {
        p256dh: String,
        auth: String,
    },
});


// Create the model class
const ModelClass = mongoose.model('notification', notificationSchema);

// Export the model
module.exports = ModelClass;
