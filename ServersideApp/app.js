var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require("fs");
var formidable = require('formidable');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require("passport");

//Security package
const helmet = require('helmet');


// var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//Load configurations
var configurations = require('./config.json');
var study = require(__dirname + "/study.json");
var studyApiRouter = require('./routes/api/study');
var userApiRouter = require('./routes/api/user');
var adminStudyRouter = require('./routes/admin/studymanager');
var resultRouter = require('./routes/admin/resultmanager');
var invitationRouter = require('./routes/admin/invitation');
var answerRouter = require('./routes/api/answer');
var consentRouter = require('./routes/api/consent');
var multer  = require('multer');
var app = express();
var upload = multer({ dest: 'uploads/' });
//const swaggerDocument = require('./swagger.json');
const expressSwagger = require('express-swagger-generator')(app);
let options = {
  swaggerDefinition: {
      info: {
          description: 'CAES Backend',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'scml.hci.uni-bamberg.de:3000',
      basePath: '',
      produces: [
          "application/json"
      ],
      schemes: ['http', 'https'],
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options);
//Init MongoDB connection
 var db = require('mongoose');
db.Promise = global.Promise;
//Please change string based on your own DB
db.connect(configurations.local_db.connectionString, {useNewUrlParser:true, uri_decode_auth: true})
  .then(()=>{
    console.log("Database connected");
})
  .catch(err => {
    console.log("Failed to connect to database");
    process.exit();
  }); 
  var Study = require('./entities/study');
  var fs = require('fs');



// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*8}
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
require('./config/passport')(passport);
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false,limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static(__dirname + "/views/public"));
app.use(express.static(__dirname + "/media"));

app.get('/', function(req, res){
  res.render('login');
});

app.use('/admin', express.static(__dirname + '/views/admin'));
const {ensureAuthenticated} = require('./config/auth');
app.get('/admin/editor',ensureAuthenticated, function (req, res) {
  res.render('admin/editor', study);
});

app.post('/admin/saveJSON', function (request, respond) {
  var filePath = __dirname + "/study.json";
  console.log('Saving JSON…');
  var jsonString = JSON.stringify(request.body, null, 2);
  study = request.body;
  fs.writeFile(filePath, jsonString, function () {
    respond.end();
  });
});

/**
 * Upload study JSON file
 * @route POST /admin/study/export-study/:id
 * @group Admin/Study - All operations about study in administration page.
 * @returns {String} 200 - Uploaded
 * @returns {String} 400  Error from client-side
 * @returns {String} 500  Error message - Internal server error
 */
app.post('/admin/study/upload-study', upload.single('study'), function (req, res) {
  if(!req.file){
    var message = {isSuccess:false, content: "Please choose the file before uploading"}
    res.render('upload',{msg:message});
    return;
  }
  if(!req.file.path){
    var message = {isSuccess:false, content: "Please choose the file before uploading"}
    res.render('upload',{msg:message});
    return;
  }
  var data = fs.readFileSync(req.file.path,'utf8');
  
  var tobeInserted = JSON.parse(data);
  if(req.user){
    if(req.user._id){
      tobeInserted.researcher = req.user._id;
      console.log(tobeInserted.researcher);
    }
 }
  Study.createstudy(tobeInserted)
  .then(rs => {
    //console.log("ASD");
    var message = {isSuccess:true, content: "Study file updated and saved"}
    fs.unlinkSync(req.file.path);
    res.render('upload',{msg:message});
    res.end();
      //res.status(200).send("Study file updated and saved");
  })
  .catch(err=>{
    var message = {isSuccess:false, content: "Error when saving study " + err}
    res.render('upload',{msg:message});
    res.end();
  });
  
});



//Register new router here!
app.use('/', require('./routes/main.js'));
app.use('/', require('./routes/onBoarding.js'));
app.use('/', require('./routes/editor.js'));
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/statistic.js'));


app.use('/api/study',studyApiRouter);
app.use('/api/user',userApiRouter);
app.use('/api/answer',answerRouter);
app.use('/api/consent',consentRouter);
app.use('/admin/study',adminStudyRouter);
app.use('/admin/result',resultRouter);
app.use('/admin/invitation',invitationRouter);

//Use Helmet to secure HTTP
 app.use(helmet());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
