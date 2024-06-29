import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    console.log("Mail host: ", process.env.APPSETTING_MAIL_HOST);
    console.log("Mail user: ", process.env.APPSETTING_MAIL_USER);
    console.log("Mail pass: ", process.env.APPSETTING_MAIL_PASS);
    let transporter = nodemailer.createTransport({
      host: process.env.APPSETTING_MAIL_HOST,
      auth: {
        user: process.env.APPSETTING_MAIL_USER,
        pass: process.env.APPSETTING_MAIL_PASS,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'testsecurehq@gmail.com',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
};

export  {mailSender};
