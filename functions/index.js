/* eslint-disable no-constant-condition */
const {initializeApp} = require("firebase-admin/app");
const {
  onDocumentCreated,
  onDocumentWritten,
  onDocumentUpdated,
  onDocumentDeleted,
  Change,
  FirestoreEvent,
} = require("firebase-functions/v2/firestore");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");

initializeApp();
const db = getFirestore();

// eslint-disable-next-line max-len
exports.writetofirestore = onDocumentCreated("users/abc/def/{userId}", (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    // console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  // console.log(data);

  // // eslint-disable-next-line no-constant-condition
  // if (data.name === "Ongoing_Contests") {
  //   console.log("Not the doc looking for");
  //   return;
  // }

  if (data.name === "Contest_Status") {
    db.collection("users/abc/def")
        .where("matchId", "==", data.matchId)
        .where("name", "==", "Ongoing_Contests")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            // {https://firebase.google.com/docs/firestore/security/rules-fields} partial Writes are never allowed in firestore.
            doc.ref.update({...data, name: "Ongoing_Contests"});
            snapshot.ref.delete();
          });
        })
        .catch((err)=>{
          console.log(err);
        });
  }
});
