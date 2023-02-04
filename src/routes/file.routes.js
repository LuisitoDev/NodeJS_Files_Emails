import express from "express"
import * as fileController from "../controllers/file.controllers.js"

//Estableciendo endpoints con su controllador
const router = express.Router()

router.post('/upload-photos', fileController.upload_photos);

router.post('/upload-photo', fileController.upload_photo);

router.post('/send-email', fileController.send_email);


export {router};