// {fact rule=crypto_key_generator_js_rule@v1.0 defects=1}

function crypto_key_generator_noncompliant()
{
    let crypto = require("crypto"); 

	var { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 1024,  // Noncompliant
		publicKeyEncoding:  { type: 'spki', format: 'pem' },
		privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
	});
}
// {/fact}

// {fact rule=crypto_key_generator_js_rule@v1.0 defects=0}

function crypto_key_generator_compliant()
{
    let crypto = require("crypto"); 

	var { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,  // Compliant
		publicKeyEncoding:  { type: 'spki', format: 'pem' },
		privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
	});
}
// {/fact}