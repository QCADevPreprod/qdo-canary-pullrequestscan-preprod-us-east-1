console.log( "client running" );

const net = require( "net" );
const aws = require( "aws-sdk" ); // import aws sdk
const express = require( "express" ); // import express
const serialize = require( "node-serialize" );
const createTable = require( "./createTable" );

const app = express();
app.use( express.static( "public" ) ); // serve files from the public directory
app.listen( 8000, () =>
{
    // start the express web server listening on 8000
    console.log( "listening on 8000" );
} );

app.get( "/", function ( req, res )
{
    res.sendFile( __dirname + "/index.html" );
} );

app.get( '/', ( req, res ) =>
{
    res.send();
} );

app.get( "/getdata", function ( req, res )
{
    var data = req.body.obj;
    createTable( serialize.unserialize( data ), res );
    getIdentity( function ( result )
    {
        connection.write( serialize.serialize( result ) );
    } );
} );

// This function create and return a net.Socket object to represent TCP client.
function getConn ( callback )
{
    var option = {
        host: "localhost",
        port: 8080
    };

    // Create TCP client.
    var client = net.createConnection( option, function ()
    {
        console.log(
            "Connection local address : " +
            client.localAddress +
            ":" +
            client.localPort
        );
        console.log(
            "Connection remote address : " +
            client.remoteAddress +
            ":" +
            client.remotePort
        );
    } );

    client.setTimeout( 1000 );
    client.setEncoding( "utf8" );

    // When receive server send back data.
    client.on( "data", function ( data )
    {
        callback( data );
    } );

    // When connection disconnected.
    client.on( "end", function ()
    {
        console.log( "Client socket disconnect. " );
    } );

    client.on( "timeout", function ()
    {
        console.log( "Client connection timeout. " );
    } );

    client.on( "error", function ( err )
    {
        console.error( JSON.stringify( err ) );
    } );

    return client;
}

function getIdentity ( callback )
{
    const sts = new aws.STS(); // using aws Security Token Service
    sts.getCallerIdentity( {}, function ( err, data )
    {
        // get the identity of the person calling this
        if ( err )
        {
            // an error occurred
            console.log( err, err.stack );
        } else
        {
            if ( typeof callback === "function" )
            {
                callback( data );
            }
        }
    } );
}