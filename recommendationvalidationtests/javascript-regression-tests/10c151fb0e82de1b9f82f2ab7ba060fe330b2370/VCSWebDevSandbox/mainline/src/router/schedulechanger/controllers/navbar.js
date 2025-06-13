
const axios = require('axios');

/********SORCE************/
//var router = require('express').Router();
var mysql = require('mysql2/promise');
var appVars = require('../../../libs/Worker');
var dataObj = require('../libs/DataPass');
var frequents = require('../libs/FrequentCalls');
var queryScript = require('../../../libs/QueryExecute');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const util = require('util');

module.exports = router;

//modifying for our test case
function sendmail(){
axios.get("https://reqres.in/api/users?page=2")
.then((req,res) => {
     var login = req.login;
     var emailEntered = login + '@amazon.com'

      feedback = feedback(req.body,req);
       let feedbackBody = req.body;

      var transporter = nodemailer.createTransport(smtpTransport()) ;

      transporter.sendMail({
        from: "your_email",
        to: "your_receiver",
        subject: "your_subject",
        html: encodeURIComponent(req.params.html_msg) + req.params.other_msg
      });

      res.redirect('feedback_submitted');
    });
  }

  async function feedback(formBody,req) {

    var login = req.login;
    var feedback = formBody.feedback;
    var value = formBody.value;
    var process = formBody.process;

        let rows = await queryScript.sqlQuery(
        req.smPool,
        'INSERT INTO sorce_feedback (login,feedback,value,process,time_stamp) VALUES (?,?,?,?,NOW()) '
        ,[login,feedback,value,process]
        );

  }

