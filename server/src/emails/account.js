require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const sendGridApiKey=process.env.GRID_API_KEY;

sgMail.setApiKey(sendGridApiKey);

function sendWelcomeEmail (email , name) {
sgMail.send({
  to:email,
  from:"sw.ahmedadel@gmail.com",
  subject:'Thanks for join in!',
  text:`welcome to the app. ${name} let me know how you get a long with the app`,
})
}

function sendCancelationEmail (email , name) {
sgMail.send({
  to:email,
  from:"sw.ahmedadel@gmail.com",
  subject:'Deleting your account!',
  text:`we will miss you ${name}, could you please tell us why you are leaving us, we could work on it!`,
})
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}
