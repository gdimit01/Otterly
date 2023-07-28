const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
admin.initializeApp();
require("dotenv").config();

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

exports.sendEmailNotification = functions.firestore
  .document("submissions/{docId}")
  .onCreate((snap) => {
    const data = snap.data();
    const authData = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
    authData
      .sendMail({
        from: "info.otterly@gmail.com",
        to: `${data.mail}`,
        subject: "Your submission info",
        text: `${data.mail}`,
        html: `${data.mail}`,
      })
      .then(() => console.log("Successfully sent the email!"))
      .catch((err) => console.log(err));
  });
