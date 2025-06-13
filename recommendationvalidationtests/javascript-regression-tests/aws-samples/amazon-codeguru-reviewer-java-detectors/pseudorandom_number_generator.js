// {fact rule=pseudorandom-number-generators-js-rule@v1.0 defects=1}

function pseudorandom_number_generators_non_compliant()
{
    const crypto = require('crypto');
    const random = crypto.randomInt(0, 1000000000);
    // Noncompliant: PRNG is used in a context requiring unpredictability.
    crypto.hkdf('sha512', 'key', random, 'info', 64, (err, derivedKey) => {
    if (err) throw err;
    console.log(Buffer.from(derivedKey).toString('hex'));  
    });
}
// {/fact}

// {fact rule=pseudorandom-number-generators-js-rule@v1.0 defects=0}

function pseudorandom_number_generators_compliant()
{
    const crypto = require('crypto');
    const salt = crypto.randomBytes(128).toString('base64'); ; 
    // Compliant: randomBytes() method provided secure cryptographically strong PRNG.
    crypto.hkdf('sha512', 'key', salt, 'info', 64, (err, derivedKey) => {
    if (err) throw err;
    console.log(Buffer.from(derivedKey).toString('hex'));  
    });
}
// {/fact}

