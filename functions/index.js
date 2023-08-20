/* eslint-disable max-len */
/* eslint-disable no-constant-condition */
const {initializeApp} = require("firebase-admin/app");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {
  getFirestore,
  // Timestamp,
  // FieldValue,
  FieldValue,
} = require("firebase-admin/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
// const logger = require("firebase-functions/logger");

setGlobalOptions({maxInstances: 10});

initializeApp();
const db = getFirestore();

exports.moralisEventsMerge = onDocumentCreated(
    "moralis/events/Allcontests/{userId}",
    (event) => {
      const snapshot = event.data;

      if (!snapshot) {
      // logger.log("snapshot- No data associated with the event");
        return;
      }

      const data = snapshot.data();

      // logger.log("data-", data);

      // // eslint-disable-next-line no-constant-condition
      // if (data.name === "Ongoing_Contests") {
      //   // console.log("Not the doc looking for");
      //   return;
      // }

      if (data.name === "Contest_Status") {
        return db
            .collection("moralis/events/Allcontests")
            .where("matchId", "==", data.matchId)
            .where("name", "==", "Ongoing_Contests")
            .get()
            .then((snap) => {
              snap.forEach((doc) => {
                // logger.log("doc", doc.data());
                delete data.name;
                delete data.Id;
                // {https://firebase.google.com/docs/firestore/security/rules-fields} partial Writes are never allowed in firestore.
                doc.ref.update({...data});
                snapshot.ref.delete(); // here we are deleteing triggered document.
              });
            })
            .catch((err) => {
              console.log(err);
            });
      }
    },
);

exports.moralisEnterContestMerge = onDocumentCreated(
    "moralis/events/Entercontests/{userId}",
    (event) => {
      const snapshot = event.data;

      if (!snapshot) {
      // logger.log("snapshot- No data associated with the event");
        return;
      }

      const data = snapshot.data();

      // logger.log("data-", data);

      // // eslint-disable-next-line no-constant-condition
      // if (data.name === "Ongoing_Contests") {
      //   // console.log("Not the doc looking for");
      //   return;
      // }

      if (data.name === "Enter_Contest" && data.confirmed) {
        return db
            .collection("moralis/events/Entercontests")
            .where("name", "==", "Enter_Contest")
            .where("matchId", "==", data.matchId)
            .where("player", "==", data.player)
            .get()
            .then((snap) => {
              snap.forEach((doc) => {
                // logger.log("doc", doc.data());

                let deleteFields = {};

                if (doc.data().Id == data.Id && doc.data().value != undefined) {
                  data[data.team] = data.value;
                  deleteFields = {
                    team: FieldValue.delete(),
                    value: FieldValue.delete(),
                  };
                } else {
                  data[data.team] = +data.value + (+doc.data()[data.team] || 0);
                  snapshot.ref.delete(); // here we are deleteing triggered document.
                }
                // delete data.Id;
                delete data.team;
                delete data.value;

                // {https://firebase.google.com/docs/firestore/security/rules-fields} partial Writes are never allowed in firestore.
                doc.ref.update({
                  ...data,
                  ...deleteFields,
                });
              });
            })
            .catch((err) => {
              console.log(err);
            });
      } else if (data.name === "Enter_Contest") {
        snapshot.ref.delete(); // here we are deleteing triggered document.
      }
    },
);
