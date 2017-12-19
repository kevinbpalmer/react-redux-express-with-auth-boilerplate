const Nexmo = require('nexmo')

function sendSmsVerification(phoneToken, userPhoneNumber) {
  const nexmo = new Nexmo({apiKey: process.env.NEXMO_API_KEY, apiSecret: process.env.NEXMO_SECRET_KEY});

  nexmo.message.sendSms(process.env.NEXMO_PHONE_NUMBER,
    1 + userPhoneNumber,
    `Application verification code: ${phoneToken}. Valid for 10 minutes. http://localhost:3000/verify-phone`,
    (err, responseData) => {
    if (err) {
      console.log('Failed to send the sms confirmation code!', err)
    } else {
      console.log('Sent the sms confirmation code!', responseData)
    }
  })
}

module.exports = sendSmsVerification
