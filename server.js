const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev')); //must be put before your last middleware...


server.use('/api/hubs', hubsRouter);


const methodLogger = (req, res, next) => {
  console.log(`${req.method} request received`);
  next();
}

const sendName = (req, res, next) => {
  req.name = 'Christina';
  req.headers['x-customName'] = 'Christina'
  console.log(req.headers['content-type']);
  console.log("adding name...");
  console.log(req.headers['x-customName']);
  next();
}

//current second is a multiple of three

const multThree = (req, res, next) => {
  let date = new Date;
  let seconds = date.getSeconds();
  if(seconds % 3 === 0){
    next();
  } else {
    res.status(403).json({message: "not a multiple of three"})
  }
}

const lockOut = (req, res, next) => { //method to stop processing because of a certain circumstance...thisis a way to stop the chain.
  res.status(403).json({message: "API locked out!"});
}


server.get('/', methodLogger, sendName, multThree, (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});


module.exports = server;
