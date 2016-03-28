var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var auth = require('./routes/auth');
mongoose.connect('mongodb://localhost/locnameengine');

var app = express();

//CORS middleware
var allowCrossDomain = function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	  // Set custom headers for CORS
	  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	  if (req.method == 'OPTIONS') {
	    res.status(200).end();
	  } else {
	    next();
	}
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);

var stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.post('/login', auth.login);
app.get('/login', routes.login);
app.get('/dashboard', routes.dashboard);
app.all('/map/*', [require('./middlewares/validateRequest')]);

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/map/:address', routes.map);
app.get('/saveLocation', routes.saveLocation);
app.get('/register', routes.register);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map
