const nodemailer = require('nodemailer');

const { SEND_MAIL_CONFIG } = require('./config');
const transporter = nodemailer.createTransport(SEND_MAIL_CONFIG);

// module.exports.sendMail = async () => {
//   try {
//     const time = new Date().toString();

//     const info = await transporter.sendMail({
//       from: SEND_MAIL_CONFIG.auth.user,
//       to: SEND_MAIL_CONFIG.auth.user,
//       subject: 'Hello',
//       text: 'test email',
//       //   html: `
//       //   <div
//       //     class="container"
//       //     style="max-width: 90%; margin: auto; padding-top: 20px"
//       //   >
//       //     <h2>This is a testing email</h2>
//       //     <p>Please ignore this mail</p>
//       //     <p>sent at ${time}</p>
//       //   </div>
//       // `,
//     });

//     console.log(`MAIL SENT AT: ${time}`);
//     console.log(`MAIL INFO: ${info}`);
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

const time = new Date().toString();

transporter.sendMail(
  {
    from: SEND_MAIL_CONFIG.auth.user,
    to: SEND_MAIL_CONFIG.auth.user,
    subject: 'Hello',
    text: 'test email',
    html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>This is a testing email</h2>
        <p>Please ignore this mail</p>
        <p>sent at ${time}</p>
      </div>
    `,
  },
  (err, info) => {
    if (err) {
      console.log(err);

      return;
    }

    console.log(`MAIL SENT AT: ${time}`);
    console.log(`MAIL INFO: ${info.messageId}, ${info.response}`);
  }
);
