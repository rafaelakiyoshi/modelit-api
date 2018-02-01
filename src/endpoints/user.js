'use strict';
var thinky = require('thinky')({
    host: 'localhost',
    port: 28015,
    db: 'modelit'
});

var r = thinky.r;

var User = thinky.createModel('User', {
    email: String,
    password: String,
    nickname: String,
    diagrams: Array
});

exports.list = function (req, res) {
    User.orderBy({ index: r.desc('id')}).run().then(function(user){
        res.json(user);
    }).error(function(err) {
        res.json({message: err});
    })
};

exports.add = function (req, res) {
    console.log(req);
    var user = new User(req.body);
    user.save().then(function(result){
        res.json(result);
    }).error(function(err){
        res.json({message:err});
    })
};

exports.get = function (req, res) {
    console.log('tentando rodar aqui!!!!!!!!!!!');
    User.filter({email: req.params.email}).run().then(function(user){
        res.json(user);
    }).error(function(err){
        res.json({message:err});
    })
};

exports.delete = function (req, res) {
    User.get(req.params.id).run().then(function(user){
        user.delete().then(function(result){
            res.json(result);
        }).error(function(err){
            json.send({message: err});
        })
    }).error(function(err){
        res.json({message:err});
    })
};

exports.update = function (req, res) {
    User.get(req.params.id).run().then(function(user){
        if(req.body.diagrams) {
            user.diagrams = req.body.diagrams;
        }
        user.save().then(function(result){
            res.json(result);
        }).error(function(err){
            res.json({message: err});
        })
    })
};
