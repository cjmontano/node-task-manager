const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Uses ES6 syntax '`', to inject variables
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'cornel.montano@gmail.com',
        subject: 'Welcome to Task App!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendAccountCloseEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'cornel.montano@gmail.com',
        subject: 'Sorry to see you go!',
        text: `${name}, sorry to see that you deleted your account. Please let us know what we could have done to keep you.`
    })
}

// Uses ES6 shorthand syntax (does not have full syntax x: x)
module.exports = {
    sendWelcomeEmail,
    sendAccountCloseEmail
}
