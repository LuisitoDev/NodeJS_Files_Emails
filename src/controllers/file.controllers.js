import loadash from "lodash"
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";

import path from "path"

//Subir multiples fotos
export const upload_photos = async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
            
            //loop all files
            loadash.forEach(loadash.keysIn(req.files.photo), (key) => {
                let photo = req.files.photo[key];
                
                const extension = path.extname(photo.name); 
                let name = uuidv4() + extension;

                //move photo to uploads directory
                photo.mv('./uploads/' + name);

                //push file details
                data.push({
                    name: name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
}

//Subir una foto
export const upload_photo = async (req, res) => {
    
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "photo") to retrieve the uploaded file
            let photo = req.files.photo;
            
            const extension = path.extname(photo.name); 
            let name = uuidv4() + extension;
            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            photo.mv('./uploads/' + name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: name,
                    mimetype: photo.mimetype,
                    size: photo.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

export const send_email = async (req, res) => {
    
    try {
        const {emailUser} = req.body;

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: emailUser, // list of receivers
            subject: "Email Test", // Subject line
            text: "This is an email to test", // plain text body
            html: "<b>This is an email to test</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.send({
            status: true,
            message: 'Email has been sent',
            data: {
                messageId: info.messageId,
                preview_url: nodemailer.getTestMessageUrl(info),
            }
        });

    } catch (err) {
        res.status(500).send(err);
    }
}