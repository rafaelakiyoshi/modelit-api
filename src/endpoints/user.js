'use strict';
var thinky = require('thinky')({
    host: 'localhost',
    port: 28015,
    db: 'modelit'
});

var r = thinky.r;
var type = thinky.type;


var User = thinky.createModel('User', {
    id: type.string(),
    email: type.string(),
    password: type.string(),
    nickname: type.string(),
});

var Diagram = thinky.createModel('Diagram', {
    id: type.string(),
    title: type.string(),
    desc: type.string(),
    json: type.string(),
    idUser: type.string(),
});

Diagram.belongsTo(User, "user", "idUser", "id");

exports.list = function (req, res) {
    User.orderBy({ index: r.desc('id')}).run().then(function(user){
        res.json(user);
    }).error(function(err) {
        res.json({message: err});
    })
};

exports.addDiagram = function (req, res) {
    console.log('tentando salvar diagrama');
    let newDiagram = new Diagram(req.body.diagram)
    User.filter({email: req.body.user.email}).run().then(function(oldUser){
        newDiagram.user = oldUser[0];
        newDiagram.saveAll({user: true}).then(function(result) {
           console.log(result);
        }).error(function(err){
            console.log(err)
        })
    }).error(function(err){
        res.json({message:err});
    })
};

exports.listDiagram = function (req, res) {
    Diagram.filter({idUser: req.params.id}).run().then(function(diagrams){
        res.json(diagrams)
    }).error(function(err){
        res.json({message:err});
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
