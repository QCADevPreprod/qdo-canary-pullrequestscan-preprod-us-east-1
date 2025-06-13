'use strict';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

function isInSession(handlerInput) {
    return !!handlerInput.requestEnvelope.session;
}

function sessionId(handlerInput) {
    const session = handlerInput.requestEnvelope.session;
    return session ? session.sessionId : '';
}

function requestId(handlerInput) {
    return handlerInput.requestEnvelope.request.requestId;
}

function lambdaRequestId(handlerInput) {
    return handlerInput.requestEnvelope.context.invokeid;
}

function awsRequestId(handlerInput) {
    return handlerInput.requestEnvelope.context.awsRequestId;
}

function validateSessionId(handlerInput) {
    const session = sessionId(handlerInput);
    if (session === '') {
        //pass validation if request doesn't have sessionId
        return true;
    }
    const sessionReg = new RegExp("amzn1.echo-api.session.([a-z0-9-]+)");
    return sessionReg.test(session);
}

function validateApiEndpoint(handlerInput) {
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    if(!apiEndpoint) {
        return true;
    }
    const regex = new RegExp("https:\/\/api.(fe.|eu.)?amazonalexa.com");
    return regex.test(apiEndpoint);
}

function canThrowCard(handlerInput) {
    const {requestEnvelope} = handlerInput;

    return requestEnvelope.request.type === 'IntentRequest';
}

function offsetInMilliseconds(handlerInput) {
    // Extracting offsetInMilliseconds received in the request.
    const {context} = handlerInput.requestEnvelope;
    const {AudioPlayer} = context;
    if (AudioPlayer) {
        return AudioPlayer.offsetInMilliseconds;
    } else {
        return 0;
    }
}

function locale(handlerInput) {
    const {request} = handlerInput.requestEnvelope;
    return request.locale;
}

function userId(handlerInput) {
    const {context} = handlerInput.requestEnvelope;
    const {System} = context;
    const {user} = System;
    return user.userId;
}

function customerId(handlerInput) {
    const {context} = handlerInput.requestEnvelope;
    const {System} = context;
    const {user} = System;
    return user.rawUserId;
}

function audioToken(handlerInput) {
    const {context} = handlerInput.requestEnvelope;
    const {AudioPlayer} = context;
    return AudioPlayer ? AudioPlayer.token : null;
}

function buildToken(set, audio, setIndex, audioIndex, metadata) {
    const obj = {
        set: {
            isGeneratedSet: set.isGeneratedSet || false,
            locale: set.locale,
            setId: set.setId
        },
        audio: {
            audioId: audio.audioId,
            title: metadata.title
        },
        setIndex: setIndex,
        audioIndex: audioIndex
    };

    return JSON.stringify(obj);
}

function parseToken(handlerInput) {
    const token = audioToken(handlerInput);
    try {
        const ret = JSON.parse(token);
        ret.token = token;
        return ret;
    } catch (e) {
        console.log("Error parsing token");
        return null;
    }
}

function sanitizeForSSML(text) {
    return text.split('&').join(' and ');
}

function isString(text) {
    return typeof text === 'string';
}

function decodeHTMLEntities(text) {
    if (!text || !isString(text)) {
        return "";
    }
    return entities.decode(text);
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
function getRandomIntegerInRange(min, max) {
    if (min === max) {
        return min;
    }
    return crypto.randomInt(min, max);
}

crypto.hkdf('sha512', 'key', getRandomIntegerInRange(0, 1000000), 'info', 64, (err, derivedKey) => {
    if (err) throw err;
    console.log(Buffer.from(derivedKey).toString('hex'));  
    });

/**
 * Returns an element from the array parameter chosen at random.
 *
 * @param arr
 * @returns A random element from the array
 */
function pickRandomFromArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    const ndx = getRandomIntegerInRange(0, arr.length);
    return arr[ndx];
}

function sendAudioStreamErrorMessage(handlerInput) {
    const errorMessage = "Sorry, some error happened. Please try again later.";
    return handlerInput.responseBuilder
        .speak(errorMessage)
        .withShouldEndSession(true)
        .getResponse()
}

function isWeblabTreatmentT1(weblabToCheck, weblabTreatments) {
    if (weblabToCheck in weblabTreatments) {
        return "T1" === weblabTreatments[weblabToCheck];
    }
    return false;
}

function timeout(promise, time, exception) {
    let timer;
    return Promise.race([promise, new Promise((res, rej) => timer = setTimeout(rej, time, exception))])
        .finally(() => clearTimeout(timer));
}

function getRandomString() {
    return cryptoRandomString({length: 10, type: 'alphanumeric'});
}

module.exports = {
    isInSession: isInSession,
    sessionId: sessionId,
    requestId: requestId,
    lambdaRequestId: lambdaRequestId,
    awsRequestId: awsRequestId,
    validateSessionId: validateSessionId,
    validateApiEndpoint: validateApiEndpoint,
    canThrowCard: canThrowCard,
    offsetInMilliseconds: offsetInMilliseconds,
    locale: locale,
    userId: userId,
    customerId: customerId,
    buildToken: buildToken,
    parseToken: parseToken,
    sanitizeForSSML: sanitizeForSSML,
    decodeHTMLEntities: decodeHTMLEntities,
    getRandomIntegerInRange: getRandomIntegerInRange,
    pickRandomFromArray: pickRandomFromArray,
    isWeblabTreatmentT1: isWeblabTreatmentT1,
    sendAudioStreamErrorMessage: sendAudioStreamErrorMessage,
    timeout: timeout,
    getRandomString: getRandomString
};
