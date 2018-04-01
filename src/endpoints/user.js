var User = require('../models/user.js')
var Diagram = require('../models/diagram.js')

// 'use strict';
// var thinky = require('thinky')({
//     host: 'localhost',
//     port: 28015,
//     db: 'modelit'
// });

// var r = thinky.r;
// var type = thinky.type;


// var User = thinky.createModel('User', {
//     id: type.string(),
//     email: type.string(),
//     password: type.string(),
//     nickname: type.string(),
// },
//     {
//     });

// var Diagram = thinky.createModel('Diagram', {
//     id: type.string(),
//     title: type.string(),
//     desc: type.string(),
//     json: type.string(),
//     idUser: type.string(),
// });

// Diagram.belongsTo(User, "user", "idUser", "id");

exports.list = function (req, res) {
    User.orderBy({ index: r.desc('id') }).run().then(function (user) {
        res.json(user);
    }).error(function (err) {
        res.json({ message: err });
    })
};

exports.addDiagram = function (req, res) {
    console.log('tentando salvar diagrama');
    var newDiagram = new Diagram(req.body.diagram)
    Diagram.findOneAndUpdate({
        title: newDiagram.title, 
        emailOwner: newDiagram.emailOwner,
        json: newDiagram.json
    }, newDiagram, {upsert:true, 'new': true}, function (err, response) {
        if(response){
            res.json(response)
        } else {
            Diagram.findOne({
                title: newDiagram.title, 
                emailOwner: newDiagram.emailOwner,
                json: newDiagram.json}, function (error, diagrams) {
                if (error != null) {
                    res.json({ message: err });
                } else {
                    res.json(diagrams)
                }
            })
        }

    })
};

exports.listDiagram = function (req, res) {
    Diagram.find({ emailOwner: req.params.id }, function (error, diagrams) {
        if (error != null) {
            res.json({ message: err });
        } else {
            res.json(diagrams)
        }
    })
};

exports.add = function (req, res) {
    var user = new User(req.body);
    User.findOne({ email: req.body.email }, function (error, result) {
        console.log('error: ', error, 'result: ', result)
        if (result != null) {
            res.json({ message: 'user' })
        } else {
            user.save(function (error, result) {
                if (!error) {

                    res.json(result);
                } else {

                    res.json({ message: err });
                }
            });
        }
    })
};

exports.get = function (req, res) {
    console.log('tentando rodar aqui!!!!!!!!!!!');
    User.findOne({ email: req.params.email }, function (error, result) {
        if (error != null) {
            res.json({ message: error });
        } else {
            console.log(result)
            res.json(result);
        }
    })
};

exports.delete = function (req, res) {
    User.get(req.params.id).run().then(function (user) {
        user.delete().then(function (result) {
            res.json(result);
        }).error(function (err) {
            json.send({ message: err });
        })
    }).error(function (err) {
        res.json({ message: err });
    })
};

exports.update = function (req, res) {
    User.get(req.params.id).run().then(function (user) {
        if (req.body.diagrams) {
            user.diagrams = req.body.diagrams;
        }
        user.save().then(function (result) {
            res.json(result);
        }).error(function (err) {
            res.json({ message: err });
        })
    })
};
