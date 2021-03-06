const webpush = require('web-push');
const logger = require('../utils/logger');
const Notification = require('../models/notification');

exports.getSubscriber = async function (value) {
  try {
    const doc = await Notification.findOne({
      endpoint: value.endpoint,
      uid: value.uid,
      'keys.auth': value.keys.auth,
      'keys.p256dh': value.keys.p256dh,
    });

    return doc;
  } catch (err) {
    throw err;
  }
};

exports.addSubscriber = async function (value) {
  try {
    const update = {
      countries: value.countries,
      expirationTime: value.expirationTime,
    };

    const doc = await Notification.findOneAndUpdate(
      {
        endpoint: value.endpoint,
        uid: value.uid,
        'keys.auth': value.keys.auth,
        'keys.p256dh': value.keys.p256dh,
      },
      update,
      { new: true, upsert: true }
    );

    await doc.save();
  } catch (err) {
    logger.err('Error addSubscriber ' + e);
    throw err;
  }
};

function sendNotification(subscription, msg) {
  webpush.setGCMAPIKey(process.env.GCMAPI_KEY);
  webpush.setVapidDetails(
    'mailto:albert.lyubarsky@gmail.com',
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
  );

  // This is the same output of calling JSON.stringify on a PushSubscription
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: { ...subscription.keys },
  };

  webpush
    .sendNotification(pushSubscription, msg)
    .then((r) => {
      logger.silly('Notification result: ' + r);
    })
    .catch((e) => {
      logger.err('Error sendNotification ' + e);
    });
}

exports.broadcastNotification = function (delta) {
  try {
    delta.forEach(async (d) => {
      const country = d.country;
      const msg = `Country: ${country} - ${d.new} ${d.newOld}`;
      const subscribers = await Notification.find(
        { countries: { $elemMatch: { $in: [country] } } },
        { endpoint: 1, keys: 1, _id: 0 }
      );
      subscribers.forEach((subscription) => {
        sendNotification(subscription, msg);
      });
    });

  } catch (err) {
    logger.error('Error broadcastNotification ' + err);
    throw err;
  }
};
