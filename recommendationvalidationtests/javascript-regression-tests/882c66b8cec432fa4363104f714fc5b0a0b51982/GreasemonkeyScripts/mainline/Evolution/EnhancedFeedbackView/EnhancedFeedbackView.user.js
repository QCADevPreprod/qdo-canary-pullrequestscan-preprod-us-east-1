// ==UserScript==
// @author      ScottVV
// @name        Evolution Enhanced Feedback View
// @namespace   com.amazon.evolution
// @description Counts the number of total reviewers for a worker. Also includes their Job Level and Tenure at Amazon.
// @include     https://evolution.amazon.com/*
// @version     1.1.2
// @downloadURL https://code.amazon.com/packages/GreasemonkeyScripts/blobs/mainline/--/Evolution/EnhancedFeedbackView/EnhancedFeedbackView.user.js?raw=1
// @grant       none
// ==/UserScript==
if (typeof jqueryize == 'undefined') {
    jqueryize = function (fn)
    {
        var script    = document.createElement('script');
        script.src    = 'https://internal-cdn.amazon.com/btk.amazon.com/ajax/libs/jquery/1.9.1/jquery.js';
        script.onload = function()
                        {
                            var fnScript = document.createElement('script');
                            fnScript.textContent = '(' + fn.toString() + ')(jQuery.noConflict(true));';
                            document.body.appendChild(fnScript);
                        };

        document.body.appendChild(script);
    }
}

