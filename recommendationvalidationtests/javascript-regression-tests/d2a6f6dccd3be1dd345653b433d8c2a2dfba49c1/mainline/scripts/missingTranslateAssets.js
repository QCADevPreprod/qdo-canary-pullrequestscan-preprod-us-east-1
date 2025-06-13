var libxmljs = require("libxmljs");
var fs = require('fs');
path = require('path');

if (! libxmljs) {
    console.log("Cannot find libxmljs.");
    process.exit(1);
}

// Process args / file paths
var args = process.argv.slice(2);
var stringTranslatorXMLFile = args.shift();

// Old resource json cache
var baseMappingPath = args.shift();
// console.log("MappingFile: " + baseMappingPath);

// Pull the XML IDs
var stringTranslatorText = fs.readFileSync(stringTranslatorXMLFile, 'UTF-8');
var xmlDoc = libxmljs.parseXmlString(stringTranslatorText ,{ noblanks: true, noent: true, nocdata: true });

// Creating the translated strings json
var translatedLanguageStrings = {};
var tempObj = {};
for (var i = 0; i < xmlDoc.root().childNodes().length; i++) {
    if ("element" === xmlDoc.root().childNodes()[i].type()) {
        var locale = xmlDoc.root().childNodes()[i].get("locale").text();
        var translatedString = xmlDoc.root().childNodes()[i].get("text").text();
        var stringTag = xmlDoc.root().childNodes()[i].get("tag").text();
        stringTag = stringTag.replace("_MASSTRING","");

        tempObj[stringTag] = translatedString;
        translatedLanguageStrings[locale] = tempObj;
    }
}

// Check for new strings that need to be created
// Pull the resource cache
var mapping = JSON.parse(fs.readFileSync(baseMappingPath, 'UTF-8'));
var stringMapping = mapping.String;

var doc = new libxmljs.Document();
doc.node('bulkCreate');
var rootNode = doc.get('//bulkCreate');
for(var resourceString in stringMapping) {
    if (translatedLanguageStrings["en_US"][resourceString] === undefined) {
        var stringObject = stringMapping[resourceString];
        for(var x = 0; x < stringObject.length; x += 1) {
            if (stringObject[x] != undefined) {
                if (getUSLocale(stringObject[x])) {
                    rootNode
                    .node('string')
                        .node('stringSet', 'html_string_assets')
                    .parent()
                        .node('tag', resourceString)
                    .parent()
                        .node('marketplace', 'default')
                    .parent()
                        .node('locale', 'en_US')
                    .parent()
                        .node('text', stringObject[x].v)
                    .parent();
                }
            }
        }

        
    }
}
console.log(doc.toString());

function getUSLocale(strObject) {
    if (strObject.p.length === 0) {
        return true;
    }

    for(var i = 0; i < strObject.p.length; i += 1) {
        if (strObject.p[i] === 'mus') {
            return true;
        }
    }

    return false;
}
