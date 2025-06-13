// {fact rule=httpbasic_auth@v1.0 defects=1}
function non_conformant1(req, res, next) {
    var authheader = req.headers.authorization;
    console.log(req.headers);

    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }

    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user == 'admin' && pass == 'password') {

        // If Authorized user
        next();
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }

}
    // {/fact}

// {fact rule=httpbasic_auth@v1.0 defects=0}
function conformant_1(){

    var authheader = req.headers.authorization;
    console.log(req.headers);

}
    // {/fact}