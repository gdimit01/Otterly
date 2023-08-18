# Social activity app

The Social activity App is a React Native application that allows users to create events and manage events. The app integrates with Firebase's Firestore database to store event.

# Features

Create and manage events with details such as name, location, and description.
Have those events be added to the notifications screen automatically
Be able to see invites sent and invites recieved
Be able to use a simple messaging function with registered users


# Prerequisites
Before running the app, ensure that you have the following installed:

Node.js

npm or yarn
React Native CLI
Getting Started
Clone this repository to your local machine.



git clone https://github.com/your-username/event-notification-app](https://github.com/gdimit01/Otterly.git
Navigate to the project directory.

cd event-notification-app
Install the dependencies.

npm install

# or

yarn install

# Set up Firebase in your project.
Create a Firebase project on the Firebase Console.
Obtain your Firebase configuration and add it to the firebaseConfig.js file.


# Replace with your Firebase configuration
export const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID",
};
Run the app on a simulator or device.



react-native run-android

# or

react-native run-ios

# or 

you can use the command 'yarn start'

# Usage
Upon launching the app, you'll be presented with the "Welcome Screen."
If you're not logged in, you'll be prompted to log in or sign up.
Once logged in, you'll see a list of new events in the homescreen.
Using the bottom tabs, you can navigate from home, to explore, to create, to notifications and profile.

To create a new event, tap on the "Create Event".
Fill in the event details, and the event will be saved to the Firebase Firestore database.
The new event will trigger a real-time notification for all users.

