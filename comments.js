// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./Comment.model');
var db = 'mongodb://localhost/example';

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.send('Happy to be here');
});

app.get('/comments', function(req, res) {
    console.log('Getting all comments');
    Comment.find({})
        .exec(function(err, comments) {
            if (err) {
                res.send('error has occured');
            } else {
                console.log(comments);
                res.json(comments);
            }
        });
});

app.get('/comments/:id', function(req, res) {
    console.log('Getting one comment');
    Comment.findOne({
            _id: req.params.id
        })
        .exec(function(err, comment) {
            if (err) {
                res.send('error has occured');
            } else {
                console.log(comment);
                res.json(comment);
            }
        });
});

app.post('/comment', function(req, res) {
    var newComment = new Comment();

    newComment.title = req.body.title;
    newComment.url = req.body.url;
    newComment.text = req.body.text;

    newComment.save(function(err, comment) {
        if (err) {
            res.send('error saving comment');
        } else {
            console.log(comment);
            res.send(comment);
        }
    });
});

app.post('/comment2', function(req, res) {
    Comment.create(req.body, function(err, comment) {
        if (err) {
            res.send('error saving comment');
        } else {
            console.log(comment);
            res.send(comment);
        }
    });
});

app.put('/comment/:id', function(req, res) {
    Comment.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                title: req.body.title,
                url: req.body.url,
                text: req.body.text
            }
        }, {
            upsert: true
        },
        function(err, newComment) {
            if (err) {
                res.send('error updating ');
            } else {
                console.log(newComment);
                res.send(newComment);
            }
        });
});

app.delete('/comment/:id', function(req, res) {
    Comment.findOne