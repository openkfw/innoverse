import sgMail, { verified_email_address } from "@/repository/sendgrid";


// Send email template 
// DEV - Re-use or Replace this template for sending emails on the client side 
export default async function sendEmailTemplate(req, res) {
    if (req.method === 'POST') {
        try {

            // Pass emails of receiving users
            const {emails} = req.body;

            // Construct email
            const msg = {
                to: [...emails],

                from: {
                    // Verified email address is setup in .env file
                    email: verified_email_address,
                    // Alias
                    name: 'KFW',
                },

                // TODO - update subject if needed
                subject: 'InnoVerse',

                // TODO - update html with real content
                html: `
                    <html lang="en">
                    <head>
                        // apply styles to email content
                        <style>
                            p { margin-bottom: 16px; }
                        </style>
                    </head>
                    <body>
                        // update with real content 
                        <h1>PLACEHOLDER - You have been mentioned in InnoVerse comment!</h1>
                    </body>
                </html>
                `,
            };

            // Send email 
            sgMail
            .send(msg)
            .then(() =>  console.log('Email sent'))
            .catch((error) =>  console.error(error))

            res.status(200).json({message: 'Email sent successfully'});
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({message: 'Error sending email'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}