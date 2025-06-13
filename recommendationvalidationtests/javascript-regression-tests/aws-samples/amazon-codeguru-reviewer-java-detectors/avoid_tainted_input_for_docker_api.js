// {fact rule=tainted_input_for_docker_api_js_rule@v1.0 defects=1}

function tainted_input_for_docker_non_compliant()
{   
    var Dockerode = require('dockerode');
	const express = require('express');
	const app = express();
	
	app.post('/create_container',  (req, res) => {
		var docker = new Dockerode('/var/run/docker.sock' );
        // Noncompliant: Tainted input is provided for creating Docker instance.
		docker.createContainer({Image: req.params.img, Cmd: ['/bin/bash'], name: req.params.name }, function (err, container) {
			container.start(function (err, data) {
					console.log("Container created");
			});
		});
	})
}
// {/fact}

// {fact rule=tainted_input_for_docker_api_js_rule@v1.0 defects=0}

function tainted_input_for_docker_compliant()
{
    var Dockerode = require('dockerode');
	const express = require('express');
	const app = express();

	app.post('/create_container',  (req, res) => {
		var docker = new Dockerode({socketPath: '/var/run/docker.sock'});
        // Compliant: No user input is used for creating Docker instance.
		docker.createContainer({Image: 'ubuntu', Cmd: ['/bin/bash'], name: 'ubuntu-test'}, function (err, container) {
			container.start(function (err, data) {
					console.log("Container created");
			});
		});
  })
}
// {/fact}

