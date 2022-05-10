const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { SEND_MAIL_CONFIG } = require('./config');

var imap = new Imap({
  user: SEND_MAIL_CONFIG.auth.user,
  password: SEND_MAIL_CONFIG.auth.pass,
  host: 'imap.outlook.com',
  port: 993,
  tls: true,
});

imap.once('ready', () => {
  console.log('works');

  imap.openBox('INBOX', false, () => {
    imap.search(['UNSEEN'], (err, results) => {
      const f = imap.fetch(results, { bodies: '' });

      f.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, async (err, parsed) => {
            const { from, to, subject, messageId, html, date } = parsed;

            console.log('from :', from);
            console.log('to :', to);
            console.log('subject :', subject);
            console.log('messageId :', messageId);
            console.log('html :', html);
            console.log('date :', date);
          });
        });
      });

      f.once('error', (ex) => {
        return Promise.reject(ex);
      });

      f.once('end', () => {
        console.log('Done');
        imap.end();
      });
    });
  });
});

imap.connect();
