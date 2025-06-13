/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require(__dirname+'/routes')
 , article = require(__dirname+'/routes/article')
 , category = require(__dirname+'/routes/category')
 , css = require(__dirname+'/routes/css')
 , template = require(__dirname+'/routes/template')
 , auth = require(__dirname+'/routes/auth')
 , user = require(__dirname+'/routes/user')
 , http = require('http')
 , path = require('path')
 , utils = require(__dirname+"/utils")
 

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.cookieParser('some secret'));
app.use(express.session())
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.locals({
 title: "Wato",
 location: "http://wato.ethernetbucket.com",
 demo_mode: false
})
app.use(function(req,res,next){ req.locals = app.locals;next()});
app.use(app.router);

// expose public status files (listing works better with 404 logic)
app.get('/stylesheets/*', function(req, res){ res.sendfile(__dirname + '/public/' + req.url); })
app.get('/javascripts/*', function(req, res){ res.sendfile(__dirname + '/public/' + req.url); })
app.get('/fonts/*', function(req, res){ res.sendfile(__dirname + '/public/' + req.url); })
app.get('/bootstrap/*', function(req, res){ res.sendfile(__dirname + '/public/' + req.url); })
app.get('/images/*', function(req, res){ res.sendfile(__dirname + '/public/' + req.url); })

// development only
if ('development' == app.get('env')) {
app.use(express.errorHandler());
}

// remove dev directory from request

app.all('/*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
next();
});

// defines routes for readers
app.get('/', routes.index);
app.get('/article/:article_name', article.single);
app.get('/article', article.list);
app.get('/allarticles', article.all);
app.get('/category/:category_name', category.list);



// defines routes for author tools pages
app.get('/auth', auth.index); // shows login
app.post('/auth/login', auth.login); // takes form fields and sets cookie
app.get('/auth/logout', auth.logout);
app.get('/auth/article', auth.checkSession, article.articleEditor);
app.get('/auth/all', auth.checkSession, article.allArticles);
app.get('/auth/css', auth.checkSession, function(req,res){
 utils.render(req,res,'auth/notavailable', {login: true});
});
app.get('/auth/template', auth.checkSession, function(req,res){
 utils.render(req,res,'auth/notavailable', {login: true});
});

// defines routes for get/posting/putting/deleting resources
app.post('/article', auth.checkSession, article.save);
app.put('/article/:_id', article.update);
app.put('/article', auth.checkSession, article.preview);
app.del('/article', auth.checkSession, article.del);
app.post('/css', auth.checkSession, css.post);
app.get('/template/:template_name', auth.checkSession, template.file);
app.post('/template', auth.checkSession, template.post);
app.put('/template', auth.checkSession, template.preview);
app.get('/__template', auth.checkSession, article.templatePreview);




// defines routes for admins
app.get('/auth/user', auth.checkSession, user.index);
app.post('/user', auth.checkSession, user.add);
app.del('/user', auth.checkSession, user.del);
app.put('/user/password', auth.checkSession, user.changePass);
app.put('/user/permissions', auth.checkSession, user.changeLevel);



// 404 route
app.get('*',function(req,res){
 res.status(404);
 utils.render(req,res,'404');
})

if (process.argv[2] == '-install'){
 auth.createRoot();
}

http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});