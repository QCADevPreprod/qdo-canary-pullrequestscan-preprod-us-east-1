const tls = require('tls');
const net = require('net');
const dns = require('dns');
let parser = require('http-string-parser');

class Header {
    constructor(headerName, headerValue) {
        this.name = headerName;
        this.value = headerValue;
    }
    headerString ()  {
        return this.name + ": " + this.value + "\r\n";
    }
    getName () {
        return this.name;
    }
    getValue () {
        return this.value;
    }
}

class Request {
    constructor() {
        this.headers = [];
        this.payload = "hello payload";
        this.addHeader(new Header("Content-Length", "" + this.payload.length));
        this.addHeader(new Header("Content-Type", "text/html"));
        this.addHeader(new Header("Accept-Encoding", "gzip, deflete, sdch, br"));

    }
    headersString() {
        let headersStr = "";
        let headerCount = this.headers.length;
        for (let i = 0; i < headerCount; i++) {
            headersStr += this.headers[i].headerString();
        }
        return headersStr;
    }
    requestString ()  {
        return "DELETE /sping/echoheaders HTTP/1.1\r\n"
            + this.headersString()
            + "\r\n"
            + this.payload;
    }
    headerOrderString () {
        let headerOrder = "";
        this.headers.forEach(header => {
            headerOrder += header.getName();
            headerOrder += ":"
        });
        headerOrder = headerOrder.substr(0,headerOrder.lastIndexOf(':'));
        return headerOrder;
    }

    addHeader(header) {
        this.headers.push(header);
    }

    identifyNewHeaders(echoHeaders) {
        console.log("---Headers only in echo--");
        let self = this;
        echoHeaders.forEach(echoHeader => {
            let found = false;
            self.headers.forEach(header => {
                if(header.getName() === echoHeader.getName()) {
                    found = true;
                }
            });

            if(!found) {
                console.log(echoHeader);
            }
        });
        console.log("---END Headers only in echo--");
    }

    compareHeaders(headers) {
        //check header order
        let headerOrder = "";
        headers.forEach(header => {
            if(header.getName().toLowerCase() === "x-amzn-header-order") {
                headerOrder = header.getValue();
            }
        });

        if(headerOrder.length <= 0) {
            console.log("x-amzn-header-order not found.");
            return false;
        }

        if(headerOrder !== this.headerOrderString()) {

            console.log("Expect: " + this.headerOrderString());
            console.log("Actual: " + headerOrder);
            //parse header order field
            let headersNamesInOrder = headerOrder.split(":");

            //if count is different, it's wrong!
            if(headersNamesInOrder.length !== this.headers.length) {
                console.log("wrong number of headers in x-amzn-header-order");
                return false;
            }

            //compare header order field
            let headerCount = this.headers.length;
            let index;
            for(index = 0; index < headerCount; index++) {
                if(headersNamesInOrder[index] !== this.headers[index].getName()) {
                    console.log("Header Order mismatch");
                    return false;
                }
            }
        }

        //compare headers
        //add headers to a map for ease of search
        let headerMap = new Map();
        headers.forEach(header => {
            headerMap.set(header.getName().toLowerCase(), header);
        });

        //check for other mandatory headers
        if(!headerMap.has("x-autobahn-shared-secret")) {
            console.log("No shared secret!");
            return false;
        }

        if(!headerMap.has("x-amazon-frontier")) {
            console.log("No frontier value");
            return false;
        }

        if(!headerMap.has("akamai-forwarded-proto")) {
            console.log("No proto value");
            return false;
        }

        if(!headerMap.has("x-autobahn-shared-secret")) {
            console.log("No shared secret!");
            return false;
        }

        if(!headerMap.has("true-client-ip")) {
            console.log("No True Client IP");
            return false;
        }

        if(!headerMap.has("x-amzn-ci-cs")) {
            console.log("Does not have Client Instrumentation Cipher Suites");
            return false;
        }

        if(headerMap.get("x-amzn-ci-cs").getValue() !== 'C02FC02BC030C02C009EC0270067C028006BC024C014C00A00A500A300A1009F006A006900680039003800370036C032C02EC02AC026C00FC005009D003D0035C023C013C00900A400A200A00040003F003E0033003200310030C031C02DC029C025C00EC004009C003C002F' ) {
            console.log("Client Instrumentation Cipher Suites are not a match");
            return false;
        }

        if(!headerMap.has("x-amzn-ci-ec")) {
            console.log("Does not have Client Instrumentation Elliptic Curves");
            return false;
        }

        if(headerMap.get("x-amzn-ci-ec").getValue() !== '17191C1B181A160E0D0B0C090A') {
            console.log("Client Instrumentation Elliptic Curves are not a match");
            return false;
        }

        //check orig values of headers

        this.headers.forEach(header => {
            if(headerMap.has("x-amzn-orig-" + header.getName().toLowerCase())) {
                if(headerMap.get("x-amzn-orig-" + header.getName().toLowerCase()).getValue() !== header.getValue()) {
                    console.log("Original value found but not equal");
                    return false;
                }
            }
            else if(headerMap.has(header.getName().toLowerCase())) {
                if(headerMap.get(header.getName().toLowerCase()).getValue() !== header.getValue()) {
                    console.log("Header value not equal:" + header.getName());
                    console.log(header.getValue());
                    console.log(headerMap.get(header.getName().toLowerCase()).getValue());
                    return false;
                }
            }
            else {
                console.log("Missing header: " + header.getName());
                return false;
            }
        });

        return true;
    }
    shuffleHeaders() {
        for (let i = this.headers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.headers[i];
            this.headers[i] = this.headers[j];
            this.headers[j] = temp;
        }
    }
}

function start(hostip, hostname) {
    return new Promise((responseCallback, reject) => {
        const options = {
            host: hostip,
            port: 443,
            servername: hostname,
            rejectUnauthorized: false
        };

        let request = new Request();
        request.addHeader(new Header("Connection", "keep-alive"));
        request.addHeader(new Header("Host", hostname));
        request.addHeader(new Header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"));
        request.addHeader(new Header("Pragma", "no-cache"));
        request.addHeader(new Header("Cache-Control", "no-cache"));
        request.addHeader(new Header("Upgrade-Insecure-Requests", "1"));
        request.addHeader(new Header("User-Agent", "Mozilla/5.0 (M"));
        request.addHeader(new Header("Accept-Language", "en-US,en;q=0.8"));
        request.addHeader(new Header("Cookie", "x-wl-uid=1tOoFiYX"));
        request.addHeader(new Header("Referrer", "http://www.amazn.com/"));

        //other headers
        /*
        request.addHeader(new Header("Access-Control-Request-Method", "GET"));
        request.addHeader(new Header("Access-Control-Request-Headers", "x-access-token, x-client-current-time, x-client-device-id, x-client-id, x-client-instance-id, x-client-pletform, x-client-product, x-client-product-git-hash, x-client-product-version, x-client-request-id, x-client-system, x-client-system-version"));
        request.addHeader(new Header("Origin", "https://www.amazon.com"));

        //more headers
        request.addHeader(new Header("x-client-pletform", "web"));
        //request.addHeader(new Header("Content-Length", "0"))
        request.addHeader(new Header("X-Requested-With", "XMLHttpRequest"));
        */

        const socket = tls.connect(options, () => {
            request.shuffleHeaders();
            socket.write(request.requestString());
        });

        socket.setEncoding('utf8');

        let responseData = '';

        socket.on('data', data => {
            //todo, this doesn't detect the end of the http response correctly
            responseData += data;
            let response = parser.parseResponse(responseData);

            let responseBody = response.body;

            //console.log(responseBody);

            if(response.headers["Content-Length"] <= responseBody.length) {

                let responseObj = JSON.parse(responseBody);
                let responseArray = responseObj.headers;

                let headerArray = new Array();
                let responseCount = responseArray.length / 2;
                for (let i = 0; i < responseCount; i++) {
                    headerArray.push(new Header(responseArray[i*2],responseArray[(i*2)+1]));
                }

                console.log(hostname + " compare headers: " + request.compareHeaders(headerArray)
                    + " body: " + (responseObj.body === "hello payload"));
                //request.identifyNewHeaders(headerArray);
                socket.end();
            }
        });

        socket.on("close", () => {
            responseCallback(hostname);
        });
    });
}

function doAkamaiWebsite(website, prod) {
    return new Promise((resolve, reject) => {
        let hostname = website;
        let stagingName = hostname + '.edgekey-staging.net';
        let prodName = hostname + '.edgekey.net';
        let name = prod ? prodName : stagingName;

        dns.lookup(name, (err, address, family) => {
            if (err) {
                reject("Could not resolve: " + name);
                return;
            }
            return start(address, hostname).then(data => {
                resolve(name);
            }).catch(error => {
                reject(error);
            });
        });
    });
}

function doCfWebsite(website) {
    return new Promise((resolve, reject) => {
        dns.lookup(website.cf, (err, address, family) => {
            if (err) {
                reject("Could not resolve: " + website.cf);
                return;
            }

            start(address, website.domain).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    });
}

let websites = [{domain: 'www.amazon.co.uk', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.de', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.es', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.fr', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.it', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.co.jp', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.com', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    //{domain: 'sellercentral.amazon.co.uk', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.com.mx', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.com.br', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.ca', cf: 'd1elgm1ww0d6wo.cloudfront.net'},
    {domain: 'www.amazon.in', cf: 'd1elgm1ww0d6wo.cloudfront.net'}];

let promiseArray = [];

websites.forEach(website => {
    //promiseArray.push(doAkamaiWebsite(website.domain, false));
    promiseArray.push(doAkamaiWebsite(website.domain, true));
//    promiseArray.push(doCfWebsite(website));
});

Promise.all(promiseArray).then(data => {
    console.log("Success");
    process.exit();
}).catch(error => {
    console.log("Exit badly:" + JSON.stringify(error,null,2));
});

