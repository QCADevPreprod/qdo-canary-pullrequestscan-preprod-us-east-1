// ==UserScript==
// @name         Lane Management Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        0.0.0.0:4321/*
// @match        http://*.internal-support-tools.onsite.fba.a2z.com/*
// @match        trans-logistics.amazon.com/ccs/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
//**************************************************************************
// This is used so that we can detect when the script has been loaded.
//**************************************************************************
    unsafeWindow.laneManagemenetScriptVersion = 5;

//**************************************************************************
//  Setup - set these values based on host page
//  ALSO set the first include tag above to the host domain/path
//**************************************************************************
    var theIFrameIsHidden = true; // set to false for debug use
    var TimeoutSeconds = 300; //approx 5 minutes

    var data_countryList = "US";
    var data_fcGroupList = "3PL,vendor_flex";

    var data_carrierList = "AMZN,AMZN_US,FEDEX,PILOT,SUREPOST,UPS,USPS";
    var data_shipMethodList = "NO_SHIPMETHOD,AMTRAN_SI,AMTRAN_SORTCENTER,AMZL_US_BULK,AMZL_US_KEY,AMZL_US_LMA,AMZL_US_LMA_AIR,AMZL_US_PREMIUM,AMZL_US_PREMIUM_AIR,AMZL_US_STD,FEDEX_3DAY,FEDEX_GROUND,FEDEX_HOME,FEDEX_NEXT_PRI,FEDEX_NEXT_STD,FEDEX_SECOND,JW_SC_BULK,PILOT_LH_TH,PILOT_LH_WG,PILOT_TH,PILOT_WG,UPS_2ND,UPS_2ND_COM,UPS_2ND_COM_SIG,UPS_2ND_SIG,UPS_3DAY,UPS_GR,UPS_NEXT,UPS_NEXT_COM,UPS_NEXT_COM_SIG,UPS_NEXT_SAT,UPS_NEXT_SAT_SIG,UPS_NEXT_SAVER,UPS_NEXT_SAVER_COM,UPS_NEXT_SAVER_COM_SIG,UPS_NEXT_SIG,UPS_NXT_SVR_SIG,UPS_SAT_2ND,UPS_SAT_2ND_COM,UPS_SAT_2ND_COM_SIG,UPS_SAT_2ND_SIG,USPS,USPS_CUBIC_PRI,USPS_FIRST_CLASS_PARCEL,USPS_PRI_DEL_CONF,USPS_PRI_SIG_CONF,USPS_SC_AT_BPM,USPS_SC_AT_PARCEL,USPS_SC_AT_STD,USPS_SC_JW_BPM,USPS_SC_JW_PARCEL,USPS_SC_JW_STD,USPS_SC_OT_BPM,USPS_SC_OT_PARCEL,USPS_SC_OT_STD,USPS_UPS_GR_BPM,USPS_UPS_GR_PARCEL,USPS_UPS_GR_STD";
    var data_entityList = "TransitTimePads,Caps";


//**************************************************************************
//  Internal conatants
//**************************************************************************
    var theIFrameId = "iframe_cimhost";
    var theIFrameTag = '<iframe id="' + theIFrameId + '" width="400" height="400" style="background:lightgrey;" sandbox></iframe>';
    var theHiddenFormId = 'cim_hidden_form_id';
    var theErrCount = 0; // this is used to track the first error and force a retry since the first request for a user typically fails due to sentry redirect
    var callbacks = {};

//**************************************************************************
//  Outer Frame functions - these functions all run in the context of the host page
//**************************************************************************
    function getIFrameDoc(){
        var MyIFrame = document.getElementById(theIFrameId);
        var MyIFrameDoc = (MyIFrame.contentWindow || MyIFrame.contentDocument);
        if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
        return MyIFrameDoc;
    }

    function submitFrame(){
        //reset the frame then call addFormDataAndSubmit() via setTimeout to give Iframe opportunity to load
        var frame = document.getElementById(theIFrameId);
        frame.src = 'about:blank';
        setTimeout(addFormDataAndSubmit, 50);
    }

    function handle_post_status(context, href, data){
        callbacks.onProgress(data);
    }

    function handle_error(context, href, data){
        callbacks.onFail(data);
    }

    function handle_spreadsheet_downloaded(context, href, data){
        var size = 0;
        if (context.status == 200){
            callbacks.onSuccess(data);
        }
    }

    function addFormDataAndSubmit(){
        GM_xmlhttpRequest({
            method: "GET",
            responseType: "json",
            url: 'https://prod-na.fonn.onsite.fba.a2z.com/get/v1/nodeNexusAPIs/getNodes?group=ONSITE&limit=9001',
            onload: function(response) {
                var nodeIds = response.response.nodes;
                var div = document.createElement('div');
                div.innerHTML = '<form id="' + theHiddenFormId + '" action="https://trans-logistics.amazon.com/ccs/downloadExcel" method="POST">' +
                    '<input type="hidden" name="countryList" value="' + data_countryList +'"/>' +
                    '<input type="hidden" name="fcGroupList" value="' + data_fcGroupList +'"/>' +
                    '<input type="hidden" name="fcList" value="' + nodeIds +'"/>' +
                    '<input type="hidden" name="carrierList" value="' + data_carrierList +'"/>' +
                    '<input type="hidden" name="shipMethodList" value="' + data_shipMethodList +'"/>' +
                    '<input type="hidden" name="entityList" value="' + data_entityList +'"/>' +
                    '<input type="hidden" name="enabledSMFlag" value="true"/>' +
                    '<input type="hidden" name="zonesWithNJ" value="false"/>' +
                    '<input type="hidden" name="sortsWithNJ" value="false"/>' +
                    '<input type="hidden" name="zoneCoverageWithNj" value="false"/>' +
                    '<input type="hidden" name="capsWithSOGs" value="true"/>' +
                    '<input type="hidden" name="dbhsWithGNJ" value="false"/>' +
                    '<input type="hidden" name="dbhsWithSMG" value="false"/>' +
                    '<input type="hidden" name="deliveryAreaNames" value=""/>' +
                    '<input type="hidden" name="dasWithNJ" value="false"/>' +
                    '<input type="hidden" name="dasWithSMG" value="false"/>' +
                    '<input type="hidden" name="isGlobalRegion" value="false"/>' +
                    '<input type="hidden" name="dbcsWithDAs" value="false"/>' +
                    '<input type="hidden" name="dbcsWithSOGs" value="false"/>' +
                    '</form>'
                var doc = getIFrameDoc();
                doc.body.appendChild(div);
                doc.getElementById(theHiddenFormId).submit();
            }
        });
    }


//**************************************************************************
//  IFrame functions - these functiona all run in th context of the IFrame
//  all communication back to the outer host page must be done through postMessageToHost()
//**************************************************************************
    function postMessageToHost(contextObject, handler, data){
        window.top.postMessage({
            contextObject: contextObject,
            href: window.location.href,
            handler: handler,//must be a function name as a string in the outer frame context
            data: data
        }, "*");
    }

    function handleGetFile(timer){
        if (timer > TimeoutSeconds){
            postMessageToHost(null, 'handle_post_status', 'Timeout waiting for data to be prepared.  Please try again.');
        }
        var err = document.getElementsByClassName('errorElement');
        if (err.length > 0){
            if (theErrCount > 0){
                postMessageToHost(null, 'handle_error', 'An error occurred, please try again');
                theErrCount = 0;
            }
            else{
                theErrCount = 1;
                postMessageToHost(null, 'submitFrame', null);
            }
        }
        else
        {
            postMessageToHost(null, 'handle_post_status', 'requesting data from CIM system: ' + timer);

            var elem = document.getElementsByClassName('download-result');
            if (elem.length > 0){
                //recurse until needed element is loaded
                if (!elem[0].hasChildNodes()){
                    setTimeout(handleGetFile, 1000, timer+1);
                }
                else{
                    postMessageToHost(null, 'handle_post_status', 'downloading spreadsheet...');

                    var msgData = elem[0].firstElementChild.href;
                    GM_xmlhttpRequest({
                        method: "GET",
                        responseType: "blob",
                        url: msgData,
                        onload: function(response) {
                            postMessageToHost(response, 'handle_spreadsheet_downloaded', response.response);
                        }
                    });
                }
            }
        }
    }

//**************************************************************************
//  startup
//**************************************************************************
    if (window.top === window.self) {//Top Frame code
        // listen for messages from IFrame
        window.addEventListener("message", function(event) {
            var theMsg = event.data;

            if (theMsg){
                var func = eval(theMsg.handler);
                if (func){
                    func(theMsg.contextObject, theMsg.href, theMsg.data);
                }
            }
        }, false);

        // add IFrame to page
        var frm = document.createElement('div');
        frm.style = theIFrameIsHidden == true ? 'visibility: hidden; width: 1px; height: 1px;' : '';
        frm.innerHTML = theIFrameTag;
        document.body.appendChild(frm);

        unsafeWindow.downloadCIMSSpreadsheet = function(onSuccess, onFail, onProgress) {
            callbacks = {
                onSuccess: onSuccess || function(){},
                onFail: onFail || function(){},
                onProgress: onProgress || function(){},
            };

            submitFrame();
        }
    }
    else {//IFrame code
        if (window.location.href.indexOf('https://trans-logistics.amazon.com/ccs/downloadExcel') == 0){
            var taskId = JSON.parse(document.body.innerText).taskId;
            if(taskId) {
                document.location = 'https://trans-logistics.amazon.com/ccs/tasks?entity=tasks&action=view&taskId=' + taskId;
            } else {
                handle_error('Failed to get the taskId');
            }
        }
        else if (window.location.href.indexOf('https://trans-logistics.amazon.com/ccs/tasks?entity=tasks&action=view&taskId=') == 0){
            setTimeout(handleGetFile, 500, 1);
        }
    }
})();