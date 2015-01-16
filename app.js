var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('maupin') ;
var nodemailer = require('nodemailer') ;
var smtpTransport = nodemailer.createTransport({
    host: 'XXXXX',
    port: 465,
    secure:true,
    debug: false,
    maxConnections: 2,
    auth: {
      user: 'XXXXX',
      pass: 'XXXXX'
    }
}) ;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/contact', function(req, res){
    debug('name: %s', req.body.name) ;
    debug('email: %s', req.body.email) ;
    debug('subject: %s', req.body.subject) ;
    debug('message: %s', req.body.message) ;

    smtpTransport.sendMail({
        from: '"' + req.body.name + '" <' + req.body.email + '>',
        to: 'dave@dchorton.com',
        subject: 'Contact request from susanmaupin.com: ' + req.body.subject,
        text: req.body.message
    }, function(error, response){
        if(error){
            console.log(error);
            res.json({
                result: false,
                message: 'Oops!. There was an error of some sort sending your message.  Would you mind contacting me directly at susan@susanmaupin.com?'
            });
        }else{
            res.json({
                result: true,
                message: 'Thanks!  Your message has been sent, and I will be in touch shortly!'
            });
            debug("Message sent: ", response);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });    
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
 
app.listen( 3005, function() {
    debug("Express server listening on port 3005, environment: " + app.get('env') );
});


module.exports = app;
