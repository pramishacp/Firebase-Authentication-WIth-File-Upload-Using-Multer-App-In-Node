const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cluster = require('cluster');
const router = require('./routes');

// const config = require('./config');
// const url = "mongodb://localhost:27017/myapp" 
// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true
// });

const admin = require("firebase-admin");
const serviceAccount = require("./config/firebase/provider-customer-application-firebase-adminsdk-y7s5l-5558fbc026.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://provider-customer-application.firebaseio.com"
});

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 
app.use(cors({ origin: true }));
app.use('/', router);

app.listen(4212, () => {
    console.log(`the application is listening on port 4212`);
})
