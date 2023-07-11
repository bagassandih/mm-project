const dotenv = require('dotenv');

function generateVerificationCode(digits){
  let code = []

  // sanity check
  if(digits){
    for( let i = 0; i < digits; i++){
      let random = Math.floor(Math.random() * 9)
      code.push(random)
    }
  }

  // parse to string
  code = code.join('')

  return code
}

async function sendEmail(recipient, code){
    const mailjet = require('node-mailjet').connect( 
        process.env.MJ_APIKEY_PUBLIC, 
        process.env.MJ_APIKEY_PRIVATE
        );

    let verificationCode = code;

    // setup send code to emali
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
        {
            From: {
            Email: 'bagassandi13@gmail.com',
            Name: 'Admin MM Project',
            },
            To: [
            {
                Email: recipient.email,
                Name: recipient.fullName,
            },
            ],
            Subject: 'Your Verification Code',
            TextPart: 'Verification Code',
            HTMLPart: `<h3>Dear ${recipient.fullName},  </h3>

            <p>
                This is your verification code: <b>${verificationCode}</b>
            </p>
            
            <p>
                Please enter the code into the verify section, and click the 'verify now' button
            </p>
            <hr>
            <h4>
                Greetings, 
                <br><br> 
                Admin MM project
            </h4>`,
        },
        ],
    })
    request
        .then(result => {
        console.log(`Email verification has sent to ${recipient.email}`)
        })
        .catch(err => {
        console.log(err.statusCode)
        })
}

module.exports = {
    generateVerificationCode,
    sendEmail
}