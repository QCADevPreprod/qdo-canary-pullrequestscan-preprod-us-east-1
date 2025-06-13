// {fact rule=origins_verified_cross_origin_communication_js_rule@v1.0 defects=1}

function non_conformant_1(){
    var iframe = document.getElementById("testiframe");
    iframe.contentWindow.postMessage("secret", "*"); // Noncompliant: * is used
}

// {/fact}

// {fact rule=origins_verified_cross_origin_communication_js_rule@v1.0 defects=1}

function conformant_1() {
    var iframe = document.getElementById("testsecureiframe");
    iframe.contentWindow.postMessage("hello", "https://secure.example.com"); // Compliant
}

// {/fact}
