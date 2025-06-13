// Source: Semgrep Typescript
// Link: https://code.amazon.com/packages/AWSGuruJavaScriptSecurityBenchmarks/blobs/mainline/--/datasets/aws_guru_java_script_security_benchmarks/Prime/javascript-semgrep-prime/javascript_cases/express/security/audit/express-check-csurf-middleware-usage.js

var express = require('express');

// Non-Compliant: Give a detection to show that 'middleware' hasn't been added
// ruleid: csrf-protection-missing-ts-rule
const app = express();

// 'Get' request for modifying private data
app.get('/edit_account', function(req, res) {
    res.render('edit_account.html', getAccounts(req.params.account_id))
})

// 'Post' request for modifying the private data
app.post('/edit_account', function(req, res) {
    let data = processData(req.body.account)
    res.render("accounts.html", data)
})

// 'Patch' request for modifying the private data
app.patch('/edit_account', parseForm, function(req, res) {
    let data = processData(req.body.account)
    res.render("accounts.html", data)
})
