'use strict';
const common = require('../common');
if (!common.hasCrypto)
    common.skip('missing crypto');

const assert = require('assert');
const crypto = require('crypto');

//
// Test PBKDF2 with RFC 6070 test vectors (except #4)
//
function testPBKDF2(password, salt, iterations, keylen, expected) {
    const actual =
        crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha256');
    assert.strictEqual(actual.toString('latin1'), expected);

    crypto.pbkdf2(password, salt, iterations, keylen, 'sha256', (err, actual) => {
        assert.strictEqual(actual.toString('latin1'), expected);
    });
}


testPBKDF2('password', 'salt', 1, 20,
    '\x12\x0f\xb6\xcf\xfc\xf8\xb3\x2c\x43\xe7\x22\x52' +
    '\x56\xc4\xf8\x37\xa8\x65\x48\xc9');

testPBKDF2('password', 'salt', 2, 20,
    '\xae\x4d\x0c\x95\xaf\x6b\x46\xd3\x2d\x0a\xdf\xf9' +
    '\x28\xf0\x6d\xd0\x2a\x30\x3f\x8e');

const expected =
    '64c486c55d30d4c5a079b8823b7d7cb37ff0556f537da8410233bcec330ed956';
const key = crypto.pbkdf2Sync('password', 'salt', 32, 32, 'sha256');
assert.strictEqual(key.toString('hex'), expected);

crypto.pbkdf2('password', 'salt', 32, 32, 'sha256', common.mustCall(ondone));
function ondone(err, key) {
    assert.ifError(err);
    assert.strictEqual(key.toString('hex'), expected);
}

// Error path should not leak memory (check with valgrind).
assert.throws(function() {
    crypto.pbkdf2('password', 'salt', 1, 20, null);
}, /^Error: No callback provided to pbkdf2$/);

// Should not work with Infinity key length
assert.throws(function() {
    crypto.pbkdf2('password', 'salt', 1, Infinity, 'sha256',
        common.mustNotCall());
}, /^TypeError: Bad key length$/);

// Should not work with negative Infinity key length
assert.throws(function() {
    crypto.pbkdf2('password', 'salt', 1, -Infinity, 'sha256',
        common.mustNotCall());
}, /^TypeError: Bad key length$/);
