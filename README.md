# Event Notification App

The Event Notification App is a React Native application that allows users to create events and receive notifications for new events. The app integrates with Firebase's Firestore database to store event and notification data.

# Features

Create and manage events with details such as name, location, and description.
Receive real-time notifications for new events.
Delete notifications and corresponding events.

# Prerequisites
Before running the app, ensure that you have the following installed:

Node.js

npm or yarn
React Native CLI
Getting Started
Clone this repository to your local machine.
bash



git clone https://github.com/your-username/event-notification-app](https://github.com/gdimit01/Otterly.git
Navigate to the project directory.

cd event-notification-app
Install the dependencies.
bash

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

# Usage
Upon launching the app, you'll be presented with the "Notifications" screen.
If you're not logged in, you'll be prompted to log in or sign up.
Once logged in, you'll see a list of notifications for new events.
Swipe left on a notification to reveal the "Delete" action and remove the notification.
Tap on a notification to view details of the corresponding event.
To create a new event, tap on the "Create Event" button on the "Notifications" screen.
Fill in the event details, and the event will be saved to the Firebase Firestore database.
The new event will trigger a real-time notification for all users.

# Acknowledgments
The Event Notification App is based on the tutorial by React Native Firebase and was modified to include event creation and notifications.

# License
This project is licensed under the MIT License. Feel free to use and modify it according to your needs.

# Contributions
Not accepting pull requests at this time.
