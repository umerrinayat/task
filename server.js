var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

var port = 3000;

var index = require('./routes/index');
var tasks = require('./routes/tasks');

var app = express();


// Set Engine 
app.set('views' , path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





function getWebsiteTitle(webLink){
    console.log(webLink);
    var httpCheck = webLink.substring(0, 7);
    if(httpCheck != 'http://' ){
        webLink = 'http://' + webLink;
    }

    request(webLink, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var title = $("title").text();
            console.log(title);
            return {
                url: webLink,
                title: title,
                res: response
            };
            
        }
    });
}



function getData(len, webAdd, callBackFunction){
    // console.log(webAdd);
    // console.log(len);
    var webData = [];
    // if(len > 1){
    //     for(var i=0; i<len; i++){
    //     }
    // }else{
        var httpCheck = webAdd.substring(0, 7);
        if(httpCheck != 'http://' ){
            webAdd = 'http://' + webAdd;
        }

        request(webAdd, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                var title = $("title").text();
                let data = {
                    url: webAdd,
                    title: title
                };

                webData.push(data);
            }
            else{
                console.log(response);
            }
        });

        callBackFunction(webData);

    }

    



//Set routes


app.get('/I/want/title/', function(req, res){
    
    console.log(req.query);
    console.log(Object.keys(req.query).length);

    var len = Object.keys(req.query).length;
    var webAdd = [];
    webAdd = req.query.address;
    console.log(webAdd);
    getData( len, webAdd , function(webData){
        res.render('index.html', {webData:webData});
    });

 });


//listen to port
app.listen(port, function(){
    console.log('app is started on port ' + port + ' ');
});