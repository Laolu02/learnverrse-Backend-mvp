import transporter from '../configs/mail.config.js';

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: '"Verify Email" <ademichael367@gmail.com>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
