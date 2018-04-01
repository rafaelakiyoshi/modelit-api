const fs = require('fs');

exports.coding = async (diagram) => {
    var models = `
from django.db import models
`
var myDiagram = JSON.parse(diagram.json)
    var attr = catchAttr(myDiagram.nodeDataArray, myDiagram.linkDataArray)
    for (var fragment in myDiagram.nodeDataArray) {
       for(var link in myDiagram.linkDataArray){
           if(myDiagram.nodeDataArray[fragment].key == myDiagram.linkDataArray[link].from){
               if(myDiagram.linkDataArray[link].category == '-->' && myDiagram.linkDataArray[link].text.match(/is-a/i)){
                var stringAttr = ``   
                if(attr[`${myDiagram.nodeDataArray[fragment].key}`]){
                    for(var at in attr[`${myDiagram.nodeDataArray[fragment].key}`]){
                        stringAttr = stringAttr + 
`    ${attr[`${myDiagram.nodeDataArray[fragment].key}`][at]} = models.CharField(max_length=100)
                        ` 
                    }

                }
                var stringAttrDad = `` 
                findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))
                
                if(attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`]){
                    console.log(attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`], `${findKey(myDiagram.nodeDataArray, 
                        findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`)  
                    for(var at in attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`]){
                        stringAttrDad = stringAttrDad + 
`    ${attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`][at]} = models.CharField(max_length=100)
` 
                    }
                    console.log('A STRING DAD: ', stringAttrDad)
                }
                    models = models +`
class ${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to)}(models.Model):
${stringAttrDad}

class ${myDiagram.nodeDataArray[fragment].text}(${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to)}):
${stringAttr}
`
               } else if(myDiagram.linkDataArray[link].to.match(/^quality.*/)) {
  
               } else {

                var stringAttr = `` 
                findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))
                
                if(attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`]){
                    console.log(attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`], `${findKey(myDiagram.nodeDataArray, 
                        findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`)  
                    for(var at in attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`]){
                        stringAttr = stringAttr + 
`    ${attr[`${findKey(myDiagram.nodeDataArray, findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to))}`][at]} = models.CharField(max_length=100)
` 
                    }
                    console.log('A STRING: ', stringAttr)
                }
                models = models +`
class ${findText(myDiagram.nodeDataArray, myDiagram.linkDataArray[link].to)}(models.Model):
${stringAttr}
`
               }
           }
       }
    }
    classGenerator(models)
};

classGenerator = (classInfo) => {

    fs.writeFile(__dirname + '/../../django-boilerplate/mysite/mysite/models.py', classInfo, (err) => {
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
    var attr = []
    for (var fragment in nodeDataArray) {
        attr[`${nodeDataArray[fragment].key}`] = []
       for(var link in linkDataArray){
           if(nodeDataArray[fragment].key == linkDataArray[link].from){
                if(linkDataArray[link].to.match(/^quality.*/)) {
                    console.log(nodeDataArray[fragment].key, linkDataArray[link].to)
                    attr[`${nodeDataArray[fragment].key}`].push(findText(nodeDataArray, linkDataArray[link].to))

                }
            }
        }
    }
    return attr;
}