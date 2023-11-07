const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const email = (fileName, blacklist) => {
  console.log(`Starting to sending email backup - ${fileName}`)

  try {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Kelbi Backup ${new Date().toISOString().slice(0, 10)} | All Tables? ${blacklist ? 'Yes' : 'No'}`,
      html: emailBody(blacklist),
      attachments: [
        {
          fileName,
          path: path.join(fileName)
        }
      ]
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return
      }

      console.log('Email successfully sent: ', info)

      fs.unlinkSync(fileName)
      fs.unlinkSync(fileName.replace('.zip', '.sql'))
    })
  } catch (error) {
    console.error('Fail to sending email: ', error)

    if (fileName) {
      fs.unlinkSync(fileName)
      fs.unlinkSync(fileName.replace('.zip', '.sql'))
    }
  }
}

const emailBody = (blacklist) => {
  const body = `
    <h1>Kelbi Backup - ${new Date().toISOString().slice(0, 10)}</h1>
    <p>This email contains the backup of the Kelbi database ${blacklist ? 'with' : 'without'} the table blacklist.</p>
    <img src='https://i.pinimg.com/564x/d8/08/65/d80865fe32e6bc822ecb512bfa002dd5.jpg' alt='Kelbi Img'/>
    <p>Sent by discord-bot</p>
  `

  return body
}

module.exports = email
