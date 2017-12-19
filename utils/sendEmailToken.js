const nodemailer = require('nodemailer');

function sendEmailToken(emailAddress, token, passwordReset) {
  console.log('Attempting to send an email token')

  // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    })

    if (passwordReset === true) {
      let mailOptions = {
         from: '"Your Application 👻" <register@yourapp.com>', // sender address
         to: emailAddress, // list of receivers
         subject: 'Please Verify Your Email Address ✔', // Subject line
         html: `Your new email reset link is below
         <br /> Please click <a href='http://localhost:3000/forgot-password/${token}'>here</a> to verify` // html body
     }

     // send mail with defined transport object
    return transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             return console.log(error)
         }
         console.log('Reset email sent!', info)
     })
    }

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Your Application 👻" <register@yourapp.com>', // sender address
        to: emailAddress, // list of receivers
        subject: 'Please Verify Your Email Address ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `Thanks for signing up!
        <br /> Your email address is: ${emailAddress}
        <br /> Please click <a href='http://localhost:3000/verify-email/${token}'>here</a> to verify` // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Verification email sent!', info)
    })
});
}

module.exports = sendEmailToken
