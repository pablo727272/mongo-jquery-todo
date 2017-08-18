// BOILERPLATE FOR PAUL HUMPHREY EXPRESS server.js FILES

// steps to setup this server:
// 1. create "root" folder for the entire project...
// 2. create server.js file in root of directory...  i.e. the "entry point" for the server
// 3. create "public" folder to contain the website files... i.e. what the client has access to
    // 3a. create html, css, js, images folders inside public to hold those files...
// 4. create .gitignore file  (ignore node_modules & .DS_Store, whatever else desired...)
// 6. npm init... create node project (answer prompts as needed... to create package.json info file)
    // 6a. npm install express
    // 6b. npm install body-parser
    // 6c. npm install request
    // 6d. npm install multer
    // 6e. npm install mongodb
// 7. REMEMBER TO GIVE MONGODB A NAME!!  e.g. db_name
// 8. in a new terminal tab, start "nodemon" to run express server...  listening on port defined at bottom of server.js file (e.g. 8080)
// 9. in another new terminal tab, start the database server daemon: "sudo mongod" to run mongodb... listening on dedicated port 27017...
// 10. OPTIONAL...  PREFER TO DO THIS FROM GITHUB FIRST git init...  create repository (creates .git folder) and push!

// we need these from the npm_modules foler
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var fs = require('fs')
var multer = require('multer')
var mongo = require('mongodb')

var MongoClient = mongo.MongoClient
var ObjectID = mongo.ObjectID

MongoClient.connect('mongodb://localhost:27017/mongo_todo', function(err, db){  // ENTER DATABASE NAME AFTER 27017/!

    // start the express server app
    var app = express()

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    // middleware static file server from public folder
    app.use(express.static('./public'))

    // 1. when client gets /, send our home page file from the public folder (/html/index.html) to the front-end
    app.get('/', function(req,res){
        res.sendFile('./html/index.html', {root: './public'})
    })

    // 5. receive internal post request and send the data back to the front-end
    app.post('/todo', function(req, res){
        // request the body of data from the docs named "todo-item"
        req.body['todo-item']
        // insert this data into the mongodb collection "todo"
        db.collection('todo').insert(req.body, function(err){
            console.log(err)
            res.send({success:'success!'})
        })
    })

    // 4. request get from the /todo area's data request from our front-end, look through all data in the "todo" collection, then res.send all the docs ({}) in that collection within server to post it back...
    app.get('/todo', function(req, res){
        db.collection('todo').find({}).toArray(function(err, docs){
            console.log(err)
            res.send(docs)
        })
    })

    // 7. request get from the /todo area's data request from our front-end, look through all data in the "todo" collection, then res.send all the docs ({}) in that collection within server to post it back...
    app.post('/todo/done', function(req, res){
        // request the body of data from the docs named "todo-item"
        console.log(req.body)
        var done = false;
        if ( req.body.done === 'true' ){
            done = true
        }
        // update this data into the mongodb collection "todo"
        db.collection('todo').update({"todo-item": req.body.text},{ $set: { "done": done } }, function(err){
            console.log(err)
            res.send({success:'success!'})
        })
    })

    app.post('/todo/delete', function(req, res){
        // request the body of data from the docs named "todo-item"
        console.log(req.body)
        // var done = false;
        // if ( req.body.done === 'true' ){
        //     done = true
        // }
        // update this data into the mongodb collection "todo"
        db.collection('todo').remove({}), function(err){
            console.log(err)
            res.send({success:'success!'})
        }
    })



    // 404 page
    app.get('/404', function(req,res){
        res.sendFile('./html/404.html', {root: './public'})
    })

    // 404 error handling middleware
    app.use(function(req, res, next){
        res.status(404)
        res.redirect('/404')
    })

    // listen on which port?
    app.listen(8080)

}) // end mongo
