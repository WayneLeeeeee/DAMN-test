// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// const fetch = require("node-fetch");

exports.sanityWebhookHandler = functions.https.onRequest(async (req, res) => {
  //console.log("req json: ", JSON.stringify(req));
  console.log("req method : ", req.method);
  console.log("req body json: ", JSON.stringify(req.body));
  if (req.body.projectId !== "f2w81k10") {
    console.log("projectId error");
    res.status(500).send();
  }
  try {
    console.log("run update recipe data func");
    await updateSanityRecipeData(JSON.stringify(req.body));

    res.status(200).send();
    return;
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log("There was an error in sanity function");
    res.status(400).send(err);
  }
});

const updateSanityRecipeData = async (result) => {
  const item = JSON.parse(result);
  console.log("item: ", item);
  console.log("Updating recipe: ", `${item._type}/${item._id}`);
  console.log("run the recipe func");
  if (item._type === "recipes") {
    await db
      .collection(`${item._type}`)
      .doc(`${item._id}`)
      .set(item.data, { merge: true });
  }
};

exports.sanityDeleteFireStoreRecipeWebhookHandler = functions.https.onRequest(
  async (req, res) => {
    console.log("req  : ", req);
    console.log("req method : ", req.method);
    console.log("req body json: ", JSON.stringify(req.body));
    if (req.body.projectId !== "f2w81k10") {
      console.log("projectId error");
      res.status(500).send();
    }
    try {
      console.log("run delete recipe data func");
      await deleteFireStoreRecipeData(JSON.stringify(req.body));

      res.status(200).send();
      return;
    } catch (err) {
      console.log(JSON.stringify(err));
      console.log("There was an error in sanity function");
      res.status(400).send(err);
    }
  }
);

const deleteFireStoreRecipeData = async (result) => {
  const item = JSON.parse(result);
  console.log("item: ", item);
  console.log("delete recipe: ", `${item._type}/${item._id}`);
  console.log("run the delete recipe func");
  if (item._type === "recipes") {
    await db.collection(`${item._type}`).doc(`${item._id}`).delete();
  }
};

exports.sanityIngredientsWebhookHandler = functions.https.onRequest(
  async (req, res) => {
    //console.log("req body json: ", JSON.stringify(req.body));
    if (req.body.projectId !== "f2w81k10") {
      // console.log("projectId is not f2w81k10");
      res.status(500).send();
    }
    try {
      //console.log("There success in sanity function");
      //console.log(JSON.stringify(req.body));
      await sendIngredientsData(JSON.stringify(req.body));
      res.status(200).send();
      return;
    } catch (err) {
      console.log(JSON.stringify(err));
      // console.log("There was an error in sanity function");
      res.status(400).send(err);
    }
  }
);

const sendIngredientsData = async (result) => {
  const item = JSON.parse(result);
  //   console.log("item: ", item);
  //   console.log("Updating", `${item._type}/${item._id}`);
  //   console.log("run the func");
  if (item._type === "ingredients") {
    await db
      .collection(`${item._type}`)
      .doc(`${item._id}`)
      .set(item.data, { merge: true });
    return;
  }
};

// sanity users 有任何變更 傳送到  fireStore user collection
exports.sanityUsersWebhookHandler = functions.https.onRequest(
  async (req, res) => {
    //console.log("req body json: ", JSON.stringify(req.body));
    if (req.body.projectId !== "f2w81k10") {
      // console.log("projectId is not f2w81k10");
      res.status(500).send();
    }
    try {
      //console.log("There success in sanity function");
      //console.log(JSON.stringify(req.body));
      await sendUserData(JSON.stringify(req.body));
      res.status(200).send();
      return;
    } catch (err) {
      console.log(JSON.stringify(err));
      // console.log("There was an error in sanity function");
      res.status(400).send(err);
    }
  }
);

const sendUserData = async (result) => {
  const item = JSON.parse(result);
  //   console.log("item: ", item);
  //   console.log("Updating", `${item._type}/${item._id}`);
  //   console.log("run the func");
  if (item._type === "users") {
    await db
      .collection(`${item._type}`)
      .doc(`${item._id}`)
      .set(item.data, { merge: true });
    return;
  }
};
