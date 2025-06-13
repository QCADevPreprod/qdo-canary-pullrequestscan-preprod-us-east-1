// {fact rule=express_vm_runincontext_injection@v1.0 defects=1}

const vm = require('vm');
const express = require('express');
const app = express();

function non_conformant(){

    const func = function (req,res) {
        var data = req.query.name
        var sandbox = {
            foo: data
        }
        vm.createContext(sandbox)
        vm.runInContext('safeEval(orderLinesData)', sandbox, { timeout: 2000 }) // non-conformant
    
    }

    app.get('/', func)

}

// {/fact}

// {fact rule=express_vm_runincontext_injection@v1.0 defects=0}

function conformant(){

    function testOk(userInput) {
        var sandbox = {
            foo: 1 //conformant
        }
        vm.createContext(sandbox)
        vm.runInContext('safeEval(orderLinesData)', sandbox, { timeout: 2000 }) 
    }

}

// {/fact}

