// {fact rule=insecure-grpc-connection@v1.0 defects=1}
var grpc = require('grpc');

function non_conformant1() {
    var SomethingProto = grpc.load('something.proto');

    var client = new SomethingProto.something.BookService('127.0.0.1:50051', grpc.credentials.createInsecure());

    client.list({}, function(error, something) {
        if (error)
            console.log('Error: ', error);
        else
            console.log(something);
    });
}


    // {/fact}

// {fact rule=insecure-grpc-connection@v1.0 defects=0}
function conformant1() {
    var client = new hello_proto.Greeter('localhost:50051');
    var user;
    if (process.argv.length >= 3) {
      user = process.argv[2];
    } else {
      user = 'world';
    }
    client.sayHello({name: user}, function(err, response) {
      console.log('Greeting:', response.message);
    });
  }


     // {/fact}