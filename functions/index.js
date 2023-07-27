const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
admin.initializeApp();

// Configure the email transport using the default SMTP transport and a GMail account.
// Make sure you configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const recipent_email = user.email; // The email of the user.
  const email = {
    from: '"Your App" <noreply@firebase.com>',
    to: recipent_email,
    subject: "Thanks for signing up!",
    text: "Welcome to our app! We hope you enjoy using it.",
  };

  return mailTransport.sendMail(email).then(() => {
    return console.log("Welcome email sent to:", recipent_email);
  });
});
