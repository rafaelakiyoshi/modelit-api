var User = require('../models/user.js')
var Diagram = require('../models/diagram.js')
var Coding = require('../helpers/code.js')
const shell = require('shelljs');
var cmd = require('node-cmd');
const fs = require('fs');
const path = require('path');
var zipFolder = require('zip-folder');
archiver = require('archiver');

exports.generateCode = function (req, res) {
    console.log('tentando gerar código..')
    var diagram;
    Diagram.findOne({ _id: req.params.id }, function (error, result) {
        if (error != null) {
            res.json({ message: error });
        } else {
            diagram = result;
            cmd.get(
                'git clone https://github.com/rafaelakiyoshi/django-boilerplate.git',
                function (err, data, stderr) {
                    Coding.coding(diagram).then(code => {
                        zipFolder(__dirname + '/../../django-boilerplate', './archive.zip', function (err) {
                            if (err) {
                                console.log('oh no!', err);
                            } else {
                                console.log('EXCELLENT');
                                fs.readFile(__dirname + '/../../archive.zip', function (err, data) {
                                    res.contentType("application/zip");
                                    res.download(__dirname + '/../../archive.zip');
                                });
                                // shell.rm('-rf', __dirname + '/../../archive.zip');
                                // res.end(__dirname + '/../../archive.zip')
                            }
                        });
                    })
                    console.log('the current working dir is : ', data)
                }
            );
        }
    })

};

exports.generateCodeToView = function (req, res) {
    console.log('tentando gerar código sem fazer download..')
    var diagram = req.body.diagram
    cmd.get(
        'git clone https://github.com/rafaelakiyoshi/django-boilerplate.git',
        function (err, data, stderr) {
            Coding.coding(diagram, false).then(model => {
                Coding.codingControllers(diagram, false, model[1]).then(controller => {
                    res.json({models: model[0], controllers: controller})
                })
            })
            console.log('the current working dir is : ', data)
        }
    );
};