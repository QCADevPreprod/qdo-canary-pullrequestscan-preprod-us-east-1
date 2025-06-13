// {fact rule=all-interfaces-socket-binding@v1.0 defects=1}

const net = require('net');
const server = net.createServer();
const server2 = new net.Server();
const http = require("http");
const con = new net.Socket()

function non_conformant(){

    var port_1 = 0
    var host = '' //host value is not specified -> non-conformant
    var s = con.connect(port_1, host)
    console.log(s);
 }

// {/fact}

// {fact rule=all-interfaces-socket-binding@v1.0 defects=0}

function conformant(){

    var port = 0
    var host_in = '192.168.1.1' // conformant
    var s = con.connect(port, host_in)
    console.log(s);
}

// {/fact}

