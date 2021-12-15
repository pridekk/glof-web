// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import {https, logger, firestore as functionFirestore} from "firebase-functions";
import {initializeApp} from "firebase-admin";
import {getFirestore, doc, getDoc} from "firebase/firestore";
initializeApp();

const db = getFirestore();


exports.getOwner = https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const x = Number(req.query.x);
  const y = Number(req.query.y);
  // Push the new message into Firestore using the Firebase Admin SDK.

  const docRef = await doc(db, "landOwners", `${x},${y}`);
  const docSnap = await getDoc(docRef);

  let data = null;
  if (docSnap.exists()) {
    data = docSnap.data();
    console.log("Document data:", data);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  // Send back a message that we've successfully written the message
  res.json({result: data});
});


// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functionFirestore.document("/messages/{documentId}")
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;
      // Access the parameter `{documentId}` with `context.params`
      logger.log("Uppercasing", context.params.documentId, original);
      const uppercase = original.toUpperCase();
      /**
       * You must return a Promise when performing asynchronous tasks inside a Functions such as
       * writing to Firestore.
       * Setting an 'uppercase' field in Firestore document returns a Promise.
       */
      return snap.ref.set({uppercase}, {merge: true});
    });
