import nodemailer from 'nodemailer';
import fs from 'fs';

export function sendEmail(email, files) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let attachments = [];
    if (files && files.image && Array.isArray(files.image)) {
      attachments = files.image.map(file => ({
        filename: file.originalname,
        content: file.buffer, 
      }));
    }

    if (files && files.image && files.image.length > 0) {
      const image = files.image[0]; 
      attachments.push({
        filename: image.originalname,
        content: fs.readFileSync(image.path),
        contentType: image.mimetype, 
      });
    }

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email verification",
      html: `<p>Thank you!!!
      You can download the photo bellow</p>`,
      attachments: attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent successfully");
        resolve({ status: true, message: "Email sent successfully" });
      }
    });
  });
}
