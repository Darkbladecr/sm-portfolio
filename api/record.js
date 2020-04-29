const VoiceResponse = require('twilio').twiml.VoiceResponse;

module.exports = (_, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Leave a message after the beep.');
  twiml.record({
    transcribe: false,
    maxLength: 30,
    recordingStatusCallback: '/api/record_success',
  });
  twiml.hangup();

  res.setHeader('content-type', 'text/xml');
  res.send(twiml.toString());
};
