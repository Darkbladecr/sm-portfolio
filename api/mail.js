const formidable = require('formidable');
const sgMail = require('@sendgrid/mail');
const cheerio = require('cheerio');
const fs = require('fs');

sgMail.setApiKey(process.env.sendgrid_api_key);

const directory = [
  { to: 'stefan@mitrasinovic.co.uk', forward: 'smig88@gmail.com' },
  { to: 'vlad@mitrasinovic.co.uk', forward: 'vmitrasinovic@gmail.com' },
  { to: 'blanka@mitrasinovic.co.uk', forward: 'blanka1mitra@gmail.com' },
];

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
    if (Object.keys(files).length > 0) {
      const attachments = [];
      const $ = cheerio.load(email.html);
      $('img').each(function() {
        const src = $(this).attr('src');
        const alt = $(this).attr('alt');
        if (src.includes('cid:')) {
          for (const k in files) {
            if (files[k].name === alt) {
              attachments.push({
                content: fs.readFileSync(files[k].path).toString('base64'),
                filename: alt,
                type: files[k].type,
                disposition: 'inline',
                content_id: src.replace('cid:', ''),
              });
              break;
            }
          }
        }
      });
      for (const k in files) {
        const attachmentIdx = attachments.findIndex(
          x => x.filename === files[k].name
        );
        if (attachmentIdx === -1) {
          attachments.push({
            content: fs.readFileSync(files[k].path).toString('base64'),
            filename: files[k].name,
            type: files[k].type,
            disposition: 'attachment',
          });
        }
      }
      email.attachments = attachments;
    }
    const entryIdx = directory.findIndex(x => x.to === fields.to);
    if (entryIdx > -1) {
      try {
        email.to = directory[entryIdx].forward;
        await sgMail.send(email);
      } catch (err) {
        console.log({ ...email, sender_ip: fields.sender_ip, files });
        return res.status(505).json(err);
      }
    }
    return res.json({
      ...email,
      sender_ip: fields.sender_ip,
      files,
    });
  });
};
