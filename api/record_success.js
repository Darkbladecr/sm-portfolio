const twilio = require('twilio');
const client = new twilio(process.env.twilio_sid, process.env.twilio_auth);

module.exports = async (req, res) => {
  const numbers = ['+447891935958', '+447967685383'];
  try {
    const { RecordingUrl } = req.body;
    await Promise.all(
      numbers.map(number =>
        client.messages.create({
          body: `New call: ${RecordingUrl}`,
          to: number,
          from: '+12015002898',
        })
      )
    );
  } catch (e) {
    console.log(e);
  }
  res.send('success');
};
