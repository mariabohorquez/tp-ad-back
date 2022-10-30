const nodemailer = require('nodemailer')
const reader = require('fs')

const sendEmail = async (email, subject, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'abdiel15@ethereal.email',
        pass: 'XpjCVDjxYbz1cWc8BC'
      }
    })

    const template = reader.readFileSync('./app/templates/recoveryEmail.html', 'utf8').replace('OTP_CODE', code)

    console.log(template)

    await transporter.sendMail({
      from: 'abdiel15@ethereal.email',
      to: email,
      subject,
      html: template
    })

    console.log('email sent sucessfully')
  } catch (error) {
    console.log(error, 'email not sent')
  }
}

module.exports = sendEmail
