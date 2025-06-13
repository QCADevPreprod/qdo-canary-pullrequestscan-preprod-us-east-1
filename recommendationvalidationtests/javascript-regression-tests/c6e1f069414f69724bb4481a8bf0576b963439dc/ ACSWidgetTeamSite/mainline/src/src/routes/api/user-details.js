"use strict";

var express = require("express");
var router = express.Router();
var config = require("../../config");

router.get("/", function(request, response) {
	if(!request.query.username) {
		return response.send({
			error: "No username provided"
		});
	}

	var username = request.query.username;
	var userDetails;

	if (config.isApollo) {

		var LDAP = require("ldap");
		var ldap = new LDAP();

		ldap.search("o=amazon.com", {
			filter: "(uid=" + username + ")",
			scope: "sub"
		}, function(error, data) {
			if (error) {
				userDetails = {
					gecos: username
				};
			} else {
				userDetails = data;
			}
			return response.send(userDetails);
		});
	} else {
		userDetails = {
			gecos: username
		};
		return response.send(userDetails);
	}

});

module.exports = router;