const fs = require('fs');

exports.codingControllers = async (diagram, writeFile=true, strings) => {
    var myDiagram = JSON.parse(diagram.json)
    var controller = 
`from django.http import HttpResponse
`
    for(var model in Object.keys(strings)){
        controller = controller +
`from .controller import ${Object.keys(strings)[model]}
`   
    }
    var goals = {}
    for (var fragment in myDiagram.nodeDataArray) {
        var methods = ``
        var resolutions = ``
        if(myDiagram.nodeDataArray[fragment].category == 'goal'){
            for(var link in myDiagram.linkDataArray){
                if(myDiagram.linkDataArray[link].to == myDiagram.nodeDataArray[fragment].key){
                    console.log(myDiagram.linkDataArray[link].from)
                    goals[`${myDiagram.linkDataArray[link].from}`] = []
                    goals[`${myDiagram.linkDataArray[link].from}`].push(
`    #Should resolve ${myDiagram.nodeDataArray[fragment].text} softgoal...`)
                    console.log(goals)
                }
            }
        }
        if(myDiagram.nodeDataArray[fragment].category == 'task'){
            console.log(goals)
            for(var link in myDiagram.linkDataArray){
                if(myDiagram.linkDataArray[link].to == myDiagram.nodeDataArray[fragment].key && myDiagram.linkDataArray[link].category == '-|-'){
                    methods = methods + 
`    
    ${findText(myDiagram.nodeDataArray ,myDiagram.linkDataArray[link].from)}()`
                }
            }
            console.log(goals)
            if(goals[myDiagram.nodeDataArray[fragment].key]){
                console.log('dwedwe', goals[myDiagram.nodeDataArray[fragment].key][0])
                resolutions = resolutions + goals[myDiagram.nodeDataArray[fragment].key][0]
            }
            controller = controller +
`
def ${myDiagram.nodeDataArray[fragment].text.toLowerCase().replace(' ','_')}(request):${methods}
${resolutions}
    return HttpResponse()

`
        }
    }
    if(writeFile){
        classGenerator('views', controller)
    }
    return controller
    
}


exports.coding = async (diagram, writeFile=true) => {
    var models = 
`from django.db import models
`
    var myDiagram = JSON.parse(diagram.json)
    var strings = {}
    var attr = catchAttr(myDiagram.nodeDataArray, myDiagram.linkDataArray)
    for (var fragment in myDiagram.nodeDataArray) {
        if(myDiagram.nodeDataArray[fragment].category == 'actor'){
            strings[`${myDiagram.nodeDataArray[fragment].text}`] = `
class ${myDiagram.nodeDataArray[fragment].text}(models.Model):
`
        }
    }
    for(var link in myDiagram.linkDataArray){
        if(myDiagram.linkDataArray[link].text){
            if(myDiagram.linkDataArray[link].category == '-->' && myDiagram.linkDataArray[link].text.match(/is-a/i)){
            strings[`${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].from)}`] = `
class ${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].from)}(${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to)}):
`
        }}
    }
    for (var fragment in myDiagram.nodeDataArray) {
        if(myDiagram.nodeDataArray[fragment].category == 'actor'){
            var stringAttr = ``
            for(var att in attr[`${myDiagram.nodeDataArray[fragment].text}`]){
                stringAttr = stringAttr + 
`    ${attr[`${myDiagram.nodeDataArray[fragment].text}`][att]} = models.CharField(max_length=100)
` 
            }
            strings[`${myDiagram.nodeDataArray[fragment].text}`] = strings[`${myDiagram.nodeDataArray[fragment].text}`] + 
stringAttr
        }
    }
    for(var model in strings){
        models = models + strings[model]
    }
    if(writeFile){
        var controllers = this.codingControllers(diagram, writeFile, strings)
        classGenerator('models', models)
    } else {
        return [models, strings]
    }
}


classGenerator = (file, classInfo) => {

    fs.writeFile(__dirname + `/../../django-boilerplate/mysite/mysite/${file}.py`, classInfo, (err) => {
        if (err) {
          return console.log(err);
        }
      })
};

findText = (iterator, finder) => {
    for(var x in iterator){
        if(iterator[x].key == finder){
            return iterator[x].text 
        }
    }
}

findKey = (iterator, finder) => {
    for(var x in iterator){
        if(iterator[x].text == finder){
            return iterator[x].key 
        }
    }
}

catchAttr = (nodeDataArray, linkDataArray) => {
    var attr = {}
    for (var fragment in nodeDataArray) {
        attr[`${nodeDataArray[fragment].text}`] = []
       for(var link in linkDataArray){
           if(nodeDataArray[fragment].key == linkDataArray[link].from){
                if(linkDataArray[link].to.match(/^quality.*/)) {
                    attr[`${nodeDataArray[fragment].text}`].push(findText(nodeDataArray, linkDataArray[link].to))

                }
            }
        }
    }
    return attr;
}