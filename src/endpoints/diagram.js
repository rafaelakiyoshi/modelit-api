var User = require('../models/user.js')
var Diagram = require('../models/diagram.js')
const shell = require('shelljs');
var cmd = require('node-cmd');
const fs = require('fs');
const path = require('path');
var zipFolder = require('zip-folder');
archiver = require('archiver');

exports.generateCode = function (req, res) {
    console.log('tentando Gerar Código...');
    cmd.get(
        'git clone https://github.com/rafaelakiyoshi/django-boilerplate.git',
        function(err, data, stderr){

            zipFolder(__dirname + '/../../django-boilerplate', './archive.zip', function(err) {
                if(err) {
                    console.log('oh no!', err);
                } else {
                    console.log('EXCELLENT');
                    // var file = fs.createReadStream(__dirname + '/../../archive.zip');
                    // var stat = fs.statSync(__dirname + '/../../archive.zip');
                    // res.setHeader('Content-Length', stat.size);
                    // res.setHeader('Content-Type', 'application/zip');
                    // res.setHeader('Content-Disposition', 'attachment; filename=quote.zip');
                    fs.readFile(__dirname + '/../../archive.zip' , function (err,data){
                        res.contentType("application/zip");
                        res.download(__dirname + '/../../archive.zip');
                    });
                    // file.pipe(res);
                    // shell.rm('-rf', __dirname + '/../../archive.zip');
                    // res.end(__dirname + '/../../archive.zip')
                }
            });
            console.log('the current working dir is : ',data)
        }
    );
    // shell.rm('-rf', __dirname + '/../../django-boilerplate');
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