const webpush = require('web-push');
const Notification = require('../models/notification');

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
      var i = r;
      console.log('Notification result: ', r);
    })
    .catch((e) => {
      console.log(e);
    });
}

exports.broadcastNotification = function (delta) {
  try {
    delta.forEach(async (d) => {
      const country = d.country;
      const msg = `Country: ${country} - ${d.new} {$d.newOld}`;
      const subscribers = await Notification.find(
        { countries: { $elemMatch: { $in: [country] } } },
        { endpoint: 1, keys: 1, _id: 0 }
      );
      subscribers.forEach((subscription) => {
        sendNotification(subscription, msg);
      });
    });

    // const subscribers = await Notification.find({});
    // subscribers.forEach(subscription => {
    //     sendNotification(subscription);
    // })
    // console.log(subscribers);
  } catch (err) {
    throw err;
  }
};
