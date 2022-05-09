// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const fetch = require("node-fetch");

exports.sanityWebhookHandler = functions.https.onRequest(async (req, res) => {
  //console.log("req json: ", JSON.stringify(req));
  console.log("req body json: ", JSON.stringify(req.body));
  if (req.body.projectId !== "f2w81k10") {
    console.log("projectId is not f2w81k10");
    res.status(500).send();
  }
  try {
    console.log("There success in sanity function");
    //console.log(JSON.stringify(req.body));
    await getSanityData(JSON.stringify(req.body));
    res.status(200).send();
    return;
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log("There was an error in sanity function");
    res.status(400).send(err);
  }
});

const getSanityData = async (result) => {
  const item = JSON.parse(result);
  console.log("item: ", item);
  console.log("Updating", `${item._type}/${item._id}`);
  console.log("run the func");

  await db
    .collection(`${item._type}`)
    .doc(`${item._id}`)
    .set(item.data, { merge: true });
};
