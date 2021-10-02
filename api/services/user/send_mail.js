"use strict";
const nodemailer = require("nodemailer");

async function send_mail(mail, subject, content) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'victorhypertube@gmail.com', // generated ethereal user
      pass: 'Jaimelesurf1', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Vic de Hypertube 👻" <victorhypertube@hypertube.com>', // sender address
    to: mail, // list of receivers
    subject: subject, // Subject line
    text: content // plain text body
    //html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return (info.messageId);
}



module.exports = send_mail;