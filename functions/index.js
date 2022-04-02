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
  // console.log("Setting up client", body?.projectId);
  // const id = body._id;
  // console.log("id", id);
  //for (const id of body.ids.all) {
  // https://f2w81k10.api.sanity.io/v1/data/query/production?query=*[_id=="1d904871-9a2f-4a50-a0b1-8206389e0ba9"]
  // https://f2w81k10.api.sanity.io/v1/data/query/production?query=*[_id%20==%20$id]&$id="1d904871-9a2f-4a50-a0b1-8206389e0ba9"
  // const url = `https://${body.projectId}.api.sanity.io/v2021-06-07/data/query/${body.dataset}?query=*[_id==${id}]`;
  // // `https://${body.projectId}.api.sanity.io/v2021-06-07/data/query/${body.dataset}?query=*[_id==${id}]`
  // console.log(url);
  // const resp = await (await fetch(url)).json();
  // console.log("res: ", resp);
  // const { result } = resp;
  // //console.log("下面是 result");
  // console.log("fetch result", result);
  console.log("item: ", item);
  console.log("Updating", `${item._type}/${item._id}`);
  console.log("run the func");

  await db
    .collection(`${item._type}`)
    .doc(`${item._id}`)
    .set(item.data, { merge: true });
  // for (const item of result) {
  //   console.log("Updating", `${item._type}/${item._id}`);
  //   console.log("run the func");
  //   await db
  //     .collection(`${item._type}`)
  //     .doc(`${item._id}`)
  //     .set(item, { merge: true });
  // }
  //}
};
