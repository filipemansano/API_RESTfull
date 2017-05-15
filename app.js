/**
 * Module dependencies.
 */
var express 	= require('express');
var bodyParser 	= require('body-parser');
var cors 		= require('cors');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Express configuration render.
 */
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

/**
 * DB Connection
 */
var db = require('./config/db_config');

/**
 * main app route.
 */
app.use('/', require('./routes/index'));

/**
 * User Routes
 */
app.use('/users', require('./routes/users'));


/**
 * Start Express server.
 */
app.listen(80, function(){
  console.log('App is running');
});

module.exports = app;