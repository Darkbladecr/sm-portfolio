const twilio = require('twilio');
const client = new twilio(process.env.twilio_sid, process.env.twilio_auth);

const { MessagingResponse } = twilio.twiml;

module.exports = async (req, res) => {
  const numbers = ['+447891935958', '+447967685383'];
  try {
    await Promise.all(
      numbers.map(number =>
        client.messages.create({
          body: req.body.Body,
          to: number,
          from: '+12015002898',
        })
      )
    );
  } catch (e) {
    console.log(e);
  }
  const twiml = new MessagingResponse();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};
