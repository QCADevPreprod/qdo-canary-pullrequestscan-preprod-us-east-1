// {fact rule=crypto_compliant_cipher_js_rule@v1.0 defects=1}

function crypto_compliant_cipher_non_compliant()
{   
    let crypto = require("crypto"); 
	
	var key = crypto.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
	var iv = crypto.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    // Noncompliant: DES is an insecure cipher algorithm.
	var cipher = crypto.createCipheriv("DES", key, iv);
	
	const plaintext = 'Hello world';
	cipher.setAAD(aad, {
		plaintextLength: Buffer.byteLength(plaintext)
	});
	const ciphertext = cipher.update(plaintext, 'utf8');
	cipher.final();
	const tag = cipher.getAuthTag();
}
// {/fact}

// {fact rule=crypto_compliant_cipher_js_rule@v1.0 defects=0}

function crypto_compliant_cipher_compliant()
{
    let crypto = require("crypto"); 

	var key = crypto.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
	var iv = crypto.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    // Compliant: aes-192-gcm is a secure cipher algorithm.
	var cipher = crypto.createCipheriv("aes-192-gcm", key, iv);
	
	const plaintext = 'Hello world';
	cipher.setAAD(aad, {
		plaintextLength: Buffer.byteLength(plaintext)
	});

	const ciphertext = cipher.update(plaintext, 'utf8');
	cipher.final();
	const tag = cipher.getAuthTag();
}
// {/fact}

