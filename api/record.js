const VoiceResponse = require('twilio').twiml.VoiceResponse;

module.exports = (_, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Leave a message after the beep.');
  twiml.record({
    transcribe: false,
    maxLength: 180,
    recordingStatusCallback: '/api/record_success',
    timeout: 10,
    trim: 'trim-silence',
  });
  // twiml.hangup();

  res.setHeader('content-type', 'text/xml');
  res.send(twiml.toString());
};
