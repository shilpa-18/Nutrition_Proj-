require('dotenv').config(); // SUPPORT .ENV FILES
const express = require('express'); // BRING IN EXPRESS
const app = express(); // INITILIZE APP
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser'); 

const http = require('http'); // CORE MODULE, USED TO CREATE THE HTTP SERVER
const server = http.createServer(app); // CREATE HTTP SERVER USING APP
const PORT = process.argv[2] || process.env.PORT || 3000; // INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE

const logger = require('morgan'); // TERMINAL LOGGER: SHOWS THE ROUTE AND STATUS CODE FOR EVERY REQUEST
const Auth = require('./services/auth');


app.use(cors());

// VIEW ENGINE SETUP

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); // USE MORGAN
app.use(bodyParser.urlencoded({ extended: false })); // PARSE application/x-www-form-urlencoded
app.use(bodyParser.json()); // PARSE application/json

// USE STATIC FILES (CSS, JS, IMAGES)
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// SECURITY
app.disable('x-powered-by');
app.use(Auth.authenticate);

// CONTROLLERS
app.use('/api', require('./controllers/recipe_controller')); // RECIPES CONTROLLER

// set up base routes
// "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "start": "node server.js"
// },

  
app.use('/users', require('./controllers/users_controller'));
app.use('/login', require('./controllers/sessions_controller'));


app.get('/', (req, res, next) => {
	res.json({
		"data": "Hello World"	
	});
})

/*
* START SERVER
*/

// SET THE PORT
app.set('port', PORT);

// LISTEN ON SPECIFIED PORT
server.listen(PORT);

// LOG WHICH PORT THE SERVER IS RUNNING ON
console.log('Server listening on port ' + PORT);

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// EXPORT APP
module.exports = app;