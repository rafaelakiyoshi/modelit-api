const fs = require('fs');

exports.codingControllers = async (diagram, writeFile=true, strings) => {
    var myDiagram = JSON.parse(diagram.json)
    myDiagram = parserLinkArray(myDiagram)
    var controller = 
`from django.http import HttpResponse
`
    for(var model in Object.keys(strings)){
        controller = controller +
`from .models import ${Object.keys(strings)[model]}
`   
    }
    var goals = {}
    for (var fragment in myDiagram.nodeDataArray) {
        var methods = ``
        var resolutions = ``
        if(myDiagram.nodeDataArray[fragment].category == 'goal'){
            for(var link in myDiagram.linkDataArray){
                if(myDiagram.linkDataArray[link].to == myDiagram.nodeDataArray[fragment].key){
                    console.log('AEWEEEDFWEFEW',myDiagram.linkDataArray[link].from)
                    goals[`${myDiagram.linkDataArray[link].from}`] = []
                    goals[`${myDiagram.linkDataArray[link].from}`].push(
`    #Should resolve ${myDiagram.nodeDataArray[fragment].text} softgoal...
`)
                }
            }
        }

        var orTask = []
        var orTaskName = []
        var andTaskName = []
        orTaskName[`${myDiagram.nodeDataArray[fragment].text}`] = ``
        andTaskName[`${myDiagram.nodeDataArray[fragment].text}`] = ``
        if(myDiagram.nodeDataArray[fragment].category == 'task'){
            for(var link in myDiagram.linkDataArray){
                if(myDiagram.linkDataArray[link].to == myDiagram.nodeDataArray[fragment].key && myDiagram.linkDataArray[link].category == '-|>'){
                    orTask[`${myDiagram.nodeDataArray[fragment].text}`] = true
                    
                    orTaskName[`${myDiagram.nodeDataArray[fragment].text}`] = orTaskName[`${myDiagram.nodeDataArray[fragment].text}`] + 
`    
    #or 
    ${findText(myDiagram.nodeDataArray ,myDiagram.linkDataArray[link].from)}()`.toLowerCase()
                } else if(myDiagram.linkDataArray[link].to == myDiagram.nodeDataArray[fragment].key && myDiagram.linkDataArray[link].category == '-|-'){
                    
                    andTaskName[`${myDiagram.nodeDataArray[fragment].text}`] = andTaskName[`${myDiagram.nodeDataArray[fragment].text}`] +
`    
    ${findText(myDiagram.nodeDataArray ,myDiagram.linkDataArray[link].from)}()`.toLowerCase()            
                }
            }
        }


        if(myDiagram.nodeDataArray[fragment].category == 'task'){
            for(var link in myDiagram.linkDataArray){
                if(orTask[`${myDiagram.nodeDataArray[fragment].text}`]){
                    methods = 
`    
    #Either${andTaskName[`${myDiagram.nodeDataArray[fragment].text}`]}${orTaskName[`${myDiagram.nodeDataArray[fragment].text}`]}`
                } else{
                    methods = andTaskName[`${myDiagram.nodeDataArray[fragment].text}`]                
                }
                 
            }
            if(goals[myDiagram.nodeDataArray[fragment].key]){
                resolutions = resolutions + goals[myDiagram.nodeDataArray[fragment].key][0]
            }
            controller = controller +
`
def ${myDiagram.nodeDataArray[fragment].text.toLowerCase().replace(' ','_')}(request):${methods}
${resolutions}    return HttpResponse()

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
    myDiagram = parserLinkArray(myDiagram)
    console.log(myDiagram)
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
`    ${attr[`${myDiagram.nodeDataArray[fragment].text}`][att]}
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

parserLinkArray = (diagram) => {
    for(var iterator in diagram.linkDataArray){
        if(diagram.linkDataArray[iterator].from.match(/task/)
        && diagram.linkDataArray[iterator].to.match(/goal/)
        && diagram.linkDataArray[iterator].category.match(/-\|-/)){
            var goal = diagram.linkDataArray[iterator].to
            var desc = `metatask${findText(diagram.nodeDataArray, diagram.linkDataArray[iterator].to)}`
            diagram.linkDataArray[iterator] = {
                from: diagram.linkDataArray[iterator].from,
                to: desc,
                category: diagram.linkDataArray[iterator].category
            }
            var pushing = true
            for(var y in diagram.linkDataArray){
                if(diagram.linkDataArray[y].from == desc){
                    pushing = false
                }
            }
            if(pushing){
                diagram.linkDataArray.push({
                    from: desc,
                    to: goal,
                    category: ''
                })
            }


            var pushing = true
            for(var x in diagram.nodeDataArray){
                if(diagram.nodeDataArray[x].key == desc){
                    pushing = false
                }
            }
            if(pushing){
                diagram.nodeDataArray.push({
                    category: 'task',
                    key: desc,
                    text: desc,
                    loc: '367.4945578231293 41.62494331065761',
                    group: 'actor'
                })
            }
        }
    }
    return diagram
}
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
        } if(nodeDataArray[fragment].group){
            if(nodeDataArray[fragment].category.match(/^quality.*/)) {
                var text = findText(nodeDataArray, nodeDataArray[fragment].group)
                attr[`${text}`].push(`${nodeDataArray[fragment].text} = models.CharField(max_length=100) #coming from ${nodeDataArray[fragment].category}`)

            } else if(nodeDataArray[fragment].category.match(/^resource.*/)) {
                var text = findText(nodeDataArray, nodeDataArray[fragment].group)
                attr[`${text}`].push(`${nodeDataArray[fragment].text} = models.CharField(max_length=100) #coming from ${nodeDataArray[fragment].category}`)

            }
        }
        
    }
    return attr;
}