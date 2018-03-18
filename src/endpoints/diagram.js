var User = require('../models/user.js')
var Diagram = require('../models/diagram.js')
const shell = require('shelljs');
var cmd = require('node-cmd');
const fs = require('fs');
const path = require('path');

exports.generateCode = function (req, res) {
    console.log('tentando Gerar Código...');
    cmd.run('git clone https://github.com/rafaelakiyoshi/django-boilerplate.git');
    shell.rm('-rf', __dirname + '/../../django-boilerplate');
    res.json({ message: 'ok' })
    // var newDiagram = new Diagram(req.body.diagram)
    // newDiagram.save(function (error, result) {
    //     console.log('error: ',error, 'result: ', result)
    //     if (error != null) {
    //         res.json({ message: error });
    //     } else {
    //         res.json({ message: 'ok' })
    //     }
    // })
};