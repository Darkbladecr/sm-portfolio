require('dotenv').config();
const twilio = require('twilio');
const client = new twilio(process.env.twilio_sid, process.env.twilio_auth);

client.messages
  .list({ limit: 20 })
  .then(messages => messages.forEach(m => console.log(m)));
