// {fact rule=hardcoded-credentials@v1.0 defects=1}

function hardcoded_email_credentials_noncompliant()
{
    const nodemailer = require("nodemailer");
    var name = "Some Name";
    var from = "me@gmail.com";
    var message = "This is a great message";
    var to = 'you@gmail.com';

    var smtpTransport = nodemailer.createTransport( {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            // Noncompliant: 'user' and 'password' are hard-coded here.
            user: "myname@gmail.com",
            pass: "A Great Password"
        }
    });

    var mailOptions = {
        from: from,
        to: to, 
        subject: name+' | new message !',
        text: message
    }

    smtpTransport.sendMail(mailOptions);

}
// {/fact}

// {fact rule=hardcoded-credentials@v1.0 defects=0}

function hardcoded_email_credentials_compliant()
{

    const nodemailer = require("nodemailer");
    var from = "me@gmail.com";
    var message = "This is a great message";
    var to = 'you@gmail.com';

    var user = process.env.USER;
    var pass = process.env.PASSWORD;

    var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            // Compliant: 'user' and 'password' are not hardcoded.
            user: user,                 
            pass: pass                  
        }
    });

    var mailOptions = {
        from: from,
        to: to, 
        subject: 'Some Subject',
        text: message
    }

    smtpTransport.sendMail(mailOptions);
}
// {/fact}