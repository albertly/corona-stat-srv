
const webpush = require('web-push');
const Notification = require('../models/notification');

exports.addSubscriber = async function (value) {

    try {
        const notification = new Notification(value);

        await notification.save();

    }
    catch (err) {
        throw err;
    }
};

function sendNotification(subscription) {
    
    webpush.setGCMAPIKey(process.env.GCMAPI_KEY);
    webpush.setVapidDetails(
        'mailto:albert.lyubarsky@gmail.com',
        process.env.PUBLIC_KEY,
        process.env.PRIVATE_KEY
    );


    // This is the same output of calling JSON.stringify on a PushSubscription
    const pushSubscription = {
        endpoint: subscription.endpoint, 
        keys: { ...subscription.keys }
    };

    webpush.sendNotification(pushSubscription, 'Your Push Payload Text')
        .then(r => console.log(r))
        .catch(e => console.log(e));

}

exports.broadcastNotification = async function (msg) {

    try {
        const subscribers = await Notification.find({});
        subscribers.forEach(subscription => {
            sendNotification(subscription);
        })
        console.log(subscribers);
    }
    catch (err) {
        throw err;
    }

};