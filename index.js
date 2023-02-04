import express from "express"
import fileUpload from "express-fileupload"
import cors from "cors"
import bodyParser from "body-parser"
import morgan from "morgan"

import {router} from "./src/routes/file.routes.js"

// Inicializando app
const app = express();

// Habilitando la subida de archivos
app.use(fileUpload({
    createParentPath: true
}));

//Agregando otros middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//Estableciendo ruteo
app.use('/api', router);

//Eligiendo puerto
const port = process.env.PORT || 3002;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

