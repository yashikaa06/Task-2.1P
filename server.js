const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'itsyashikageed@gmail.com', // Your email
    pass: 'himxdefdcbvmdjmh', // Your app-specific password
  },
});

// Function to send email
async function sendMail(to, subject, message) {
  const mailOptions = {
    from: 'itsyashikageed@gmail.com', // Your verified sender email
    to: to,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Your Email Was Sent Successfully: ', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Handle POST requests from the form submission
app.post('/signup', async (req, res) => {
  const email = req.body.email;
  console.log(`Received email from form: ${email}`);

  if (!email) {
    console.error('No email provided');
    return res.status(400).send('Please enter a valid email');
  }

  try {
    // Send a welcome email
    const emailSent = await sendMail(
      email,
      "Welcome to Our Daily Insider!",
      "<p>Thank you for subscribing to our Daily Insider!.</p>"
    );

    if (emailSent) {
      res.send(`
        <h1>Thank you for signing up, ${email}!</h1>
        <p>A welcome email has been sent to your inbox.</p>
      `);
    } else {
      res.status(500).send("There was an error sending the welcome email. Please try again later.");
    }
  } catch (error) {
    console.error('Error in signup process:', error);
    res.status(500).send("An unexpected error occurred. Please try again later.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
