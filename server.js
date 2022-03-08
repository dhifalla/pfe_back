const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  
  
  cors: {
    
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true

  
    
  }
});

// Only include useMongoClient only if your mongoose version is < 5.0.0
mongoose.connect(config.database,   err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const productSearchRoute = require('./routes/product-search');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoute);

 
app.get('/', (req, res, next) => {
  res.json({
    user: "dhifalla"
  });
});






let userList = new Map();

io.on('connection', (socket) => {
  let userName = socket.handshake.query.userName;
  addUser(userName, socket.id);

  socket.broadcast.emit('user-list', [...userList.keys()]);
  socket.emit('user-list', [...userList.keys()]);

  socket.on('message', (msg) => {
      socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
  })

  socket.on('disconnect', (reason) => {
      removeUser(userName, socket.id);
  })
});

function addUser(userName, id) {
  if (!userList.has(userName)) {
      userList.set(userName, new Set(id));
  } else {
      userList.get(userName).add(id);
  }
}

function removeUser(userName, id) {
  if (userList.has(userName)) {
      let userIds = userList.get(userName);
      if (userIds.size == 0) {
          userList.delete(userName);
      }
  }
}

http.listen(config.port, err => {
  console.log('Magic happens on port awesome ' + config.port);
});
