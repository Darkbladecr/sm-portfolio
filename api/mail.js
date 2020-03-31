const formidable = require('formidable');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.sendgrid_api_key);

module.exports = (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json(err);
    }
    const email = {
      to: fields.to,
      from: fields.from,
      subject: fields.subject,
      html: fields.html,
      text: fields.text,
    };
    if (fields.to == 'stefan@mitrasinovic.co.uk') {
      try {
        await sgMail.send({
          ...email,
          to: 'smig88@gmail.com',
        });
      } catch (err) {
        return res.status(505).json(err);
      }
    }
    return res.json({
      ...email,
      sender_ip: fields.sender_ip,
      attachments: fields.attachments,
      files,
    });
  });
};
