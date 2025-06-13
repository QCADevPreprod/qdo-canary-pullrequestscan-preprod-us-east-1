var express = require('express');
var router = express.Router();
var parse = require('csv-parse')
var fs = require('fs');

var app = express();

app.get('/:id', function (req, res, next) {

    contents = fs.readFileSync(req.query.file, 'utf8');

    parse(contents, {comment: '#', columns: true}, function (err, parsedDaa) {
        if (err) {
            console.log(err);
            res.render('error', {message: "Error occurred while reading file. You were on URL number " + req.params.id});
        } else {
            console.log('Starting analysis of ' + parsedData[req.params.id].url);
            res.render('analyze', {
                url: parsedData[req.params.id].url,
                gl: parsedData[req.params.id].gl,
                input_fields: [
                    {
                        name: "page_type",
                        tags: ["Can't comment", "Default", "Blank", "Clickbait", "Home/Search", "Media", "Generic", "Foreign"]
                    },
                    {
                        name: "sentiment",
                        tags: ["Neutral", "Positive", "Negative"]
                    },
                    {
                        name: "product_centricity",
                        tags: ["N/A", "Not Product centric", "Slightly product centric", "Highly product centric"]
                    },
                    {
                        name: "prepost",
                        tags: ["N/A", "Pre Purchase", "Post Purchase", "Both"]
                    },
                    {
                        name: "product_centric_themes",
                        tags: ["N/A", "Research/Info", "Hobby/DIY", "Entertainment - Digital Content"]
                    },
                    {
                        name: "non_product_centric_themes",
                        tags: ["N/A", "Experience", "News", "Info"]
                    },
                    {
                        name: "correct_gl",
                        tags: ["Can't Comment", "Wrong GL", "Correct GL"]
                    }
                ]
            });
        }
    });

});


router.post("/:id", function (req, res, next) {
    data = new Date().getTime() + ","
        + req.query.username + ","
        + req.body.url + ","
        + req.body.page_type + ","
        + req.body.sentiment + ","
        + req.body.product_centricity + ","
        + req.body.prepost + ","
        + req.body.product_centric_themes + ","
        + req.body.non_product_centric_themes + ","
        + req.body.correct_gl + ","
        + req.body.suggested_gl + ","
        + req.body.comment + ",";

    fs.appendFile(appRoot + "/public/results/results.csv", "\n" + data, function (err) {
        if (err) {
            console.log(err);
            res.render('error', {message: "Error occurred while writing file. You were on URL number " + req.params.id});
        } else {
            referrerURL = req.get('Referrer');
            res.redirect("/analyze/"
                + (parseInt(req.params.id) + 1)
                + "?"
                + "username=" + req.query.username
                + "&file=" + req.query.file
            );
        }
    });
});