import axios from "axios";

const sendEmail = async (recipientEmail, subject, message) => {
  const url = "https://api.sendpulse.com/smtp/emails";
  const data = {
    sender: {
      name: "Your Name",
      email: "your-email@example.com",
    },
    to: [
      {
        email: recipientEmail,
      },
    ],
    subject: subject,
    text: message,
  };
  const config = {
    headers: {
      Authorization: "Bearer YOUR_SENDPULSE_API_KEY",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(url, data, config);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
