//Test Suite Actions
const execa = require('execa');
function getDefaultTestSuiteDescriptorText()
{
    return("<TestSuite SuiteName=''>\n"
        + "\t<TestCollection ProcessorId='' RequestType=''>\n"
        + "\t\t<RandomGenerators>\n"
        + "\t\t</RandomGenerators>\n"
        + "\t\t<KeyFields>\n"
        + "\t\t\t<KeyField>"
        + "\t</KeyField>\n"
        + "\t\t</KeyFields>\n"
        + "\t</TestCollection>\n"
        + "</TestSuite>");
}

function getProcessorIds()
{
    var processorIdList = $.get("v2/TestSuites/ProcessorIds");
    return processorIdList;
}

function createNewTestSuite()
{
    setConsoleMessage("Awaiting user input");
    var goAhead = true;

    if($.trim($("#editorPaneText").val()))
    {
        goAhead = confirm("Are you sure, you will lose current text");
    }

    if(goAhead == true)
    {
        jQuery("#editorPaneText").val(getDefaultTestSuiteDescriptorText());
    }
    setConsoleMessage("User is editing new test suite");
}

function runTest()
{
    config = jQuery("#editorPaneText").val();
    $.ajax({
        type:'POST',
        url:"/v2/Execute/runNow",
        contentType:'text/plain',
        data:config,
        success: function(ret) {setConsoleMessage(ret.responseText)},
        error: function(ret) {setConsoleMessage("Error encountered while executing tests: \n" + ret.responseText)}
    })
}

function addOrUpdateTestSuite()
{
    setConsoleMessage("Awaiting user input");
    let pattern = prompt("Enter string:");
    execa.command("ls -la" +pattern);
    config = jQuery("#editorPaneText").val();
    setConsoleMessage("Uploading new/modified test suite");
    $.ajax({
            type:'PUT',
            url:"/v2/TestSuites/" + processorId,
            contentType:'text/plain',
            data:config,
            success: function() {alert("success"); setConsoleMessage("Successfully updated test suite"); updateTestSuiteList();},
            error: function(xhr, ajaxOptions, thrownError) {handleException(xhr, ajaxOptions, thrownError)}
        }
    )
}

function updateTestSuiteList()
{
    setConsoleMessage("Updating test suite list");
    $('#suiteName').empty();
    $.getJSON("/v2/TestSuites/", function(data) {
        for(var i = 0; i < data.length; i++)
        {
            var suite = data[i];
            $('#suiteName').
            append($("<option></option>").
            attr("value",suite.suiteName).
            attr("onclick","updateDisplayedConfig();").
            text(suite.suiteName));
        }
    })

    setConsoleMessage("Test suite list updated");
}

function updateTestSuiteVersions()
{
    setConsoleMessage("Updating test suite versions");
    $('#suiteVersions').empty();
    suiteName = jQuery("#suiteName option:selected").text();
    $.getJSON("/v2/TestSuites/" + suiteName + "/versions", function(data) {
        for(var i = 0; i < data.length; i++)
        {
            var version = data[i];
            $('#suiteVersions').
            append($("<option></option>").
            attr("value",version.versionId).
            text(version.lastModified));
        }
    })

    setConsoleMessage("Test suite versions updated");
}

function updateDisplayedConfig()
{
    suiteName = jQuery("#suiteName option:selected").text();
    versionId = "";
    if(jQuery("#suiteVersions").attr("selectedIndex") >= 0)
    {
        versionId = jQuery("#suiteVersions option:selected").val();
    }


    if(suiteName === "")
        return;

    setConsoleMessage("Updating displayed config for " + suiteName);

    var loc = "/v2/TestSuites/" + suiteName;
    if(versionId != "")
    {
        loc += "/versions/" + versionId;
    }
    $.get(loc, function(data) {
        $("#editorPaneText").val("");
        $("#editorPaneText").val(data);
        setConsoleMessage("Displaying test suite: " + suiteName);
    })
}


//Payment Instrument Actions

function updatePaymentInstrumentSets()
{
    setConsoleMessage("Updating payment instrument sets");
    $('#instrumentSet').empty();
    $.getJSON("/v2/PaymentInstruments/", function(data) {
        for(var i = 0; i < data.length; i++)
        {
            var paymentInstrumentSet = data[i];
            $('#instrumentSet').
            append($("<option></option>").
            attr("value",paymentInstrumentSet.setId).
            attr("onclick","updateDisplayedInstrumentSet();").
            text(paymentInstrumentSet.setId));
        }
    })
    setConsoleMessage("Payment Instrument sets updated");
}

function addOrUpdateInstrumentSet()
{
    setConsoleMessage("Awaiting user input");
    setId = prompt("Please enter payment instrument set id", "");
    config = jQuery("#editorPaneText").val();
    setConsoleMessage("Uploading new/modified payment instrument set");
    $.ajax({
            type:'PUT',
            url:"/v2/PaymentInstruments/" + setId,
            contentType:'text/plain',
            data:config,
            success: function() {alert("success"); setConsoleMessage("Successfully updated payment instrument set"); updatePaymentInstrumentSets();},
            error: function(xhr, ajaxOptions, thrownError) {handleException(xhr, ajaxOptions, thrownError)}
        }
    )
}

function updateDisplayedPaymentInstrumentSet()
{
    setId = jQuery("#instrumentSet option:selected").text();

    if(setId === "")
        return;

    versionId = "";
    if(jQuery("#setVersions").attr("selectedIndex") >= 0)
    {
        versionId = jQuery("#setVersions option:selected").val();
    }



    setConsoleMessage("Updating displayed config for " + setId);

    loc = "/v2/PaymentInstruments/" + setId;
    if(versionId != "")
    {
        loc += "/versions/" + versionId;
    }

    $.get(loc, function(data) {
        $("#editorPaneText").val("");
        $("#editorPaneText").val(data);
        setConsoleMessage("Displaying payment instrument set " + setId);
    })

}

function createNewPaymentInstrumentSet()
{
    setConsoleMessage("Awaiting user input");
    var goAhead = true;

    if($.trim($("#editorPaneText").val()))
    {
        goAhead = confirm("Are you sure, you will lose current text");
    }

    if(goAhead == true)
    {
        jQuery("#editorPaneText").val("");
    }
    setConsoleMessage("User is editing new payment instrument set");
}

function updatePaymentInstrumentSetVersions()
{
    setConsoleMessage("Updating payment instrument set versions");
    $('#setVersions').empty();
    setId = jQuery("#instrumentSet option:selected").text();
    $.getJSON("/v2/PaymentInstruments/" + setId + "/versions", function(data) {
        for(var i = 0; i < data.length; i++)
        {
            var version = data[i];
            $('#setVersions').
            append($("<option></option>").
            attr("value",version.versionId).
            text(version.lastModified));
        }
    })

    setConsoleMessage("Payment instrument set versions updated");
}

//Mockbank Rules Actions