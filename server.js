const cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {

    // Replace the dead worker
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

  });

  // Code to run if we're in a worker process
} else {

  const express = require('express');
  const app = express();
  const admin = require("firebase-admin");
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const morgan = require('morgan');
  const path = require('path');

  const router = require('./routes');
  const config = require('./config');

  mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  
  const serviceAccount = require('./firebase/provider-customer-application-firebase-adminsdk-y7s5l-5558fbc026.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
  });

  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/*+json' }))
  app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
  app.use(bodyParser.text({ type: 'text/html' }))
  app.use(express.static(path.join(__dirname, config.directory.static)));
  app.use('/', router);

  app.listen(config.app.port, () => {
    console.log(`application worker %d is listening on port ${config.app.port}`, cluster.worker.id);
  })

}


