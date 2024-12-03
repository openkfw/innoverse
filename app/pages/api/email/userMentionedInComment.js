// import sgMail, { verified_email_address } from "@/repository/sendgrid";


// export default async function sendEmail(req, res) {
//     if (req.method === 'POST') {
//         try {
//             const {emails} = req.body;
//             const msg = {
//                 to: [...emails],
//                 from: {
//                     email: verified_email_address,
//                     name: 'KFW',
//                 },
//                 subject: 'InnoVerse',
//                 html: `
//                     <html lang="en">
//                     <head>
//                         <style>
//                             p { margin-bottom: 16px; }
//                         </style>
//                     </head>
//                     <body>
//                         <h1>You have been mentioned in InnoVerse comment</h1>
//                     </body>
//                 </html>
//                 `,
//             };

//             sgMail
//             .send(msg)
//             .then(() => {
//               console.log('Email sent')
//             })
//             .catch((error) => {
//               console.error(error)
//             })
//             res.status(200).json({message: 'Email sent successfully'});
//         } catch (error) {
//             console.error('Error sending email:', error);
//             res.status(500).json({message: 'Error sending email'});
//         }
//     } else {
//         res.status(405).json({message: 'Method Not Allowed'});
//     }
// }