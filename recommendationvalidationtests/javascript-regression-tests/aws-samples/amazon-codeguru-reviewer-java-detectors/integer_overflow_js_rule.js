// {fact rule=integer-overflow@v1.0 defects=1}
function non_compliant_1(){

    let bigint = 41234563232789012327892787227897329; //noncompliant since using a bigint & no n
    console.log(bigint);
    }
    // {/fact}

// {fact rule=integer-overflow@v1.0 defects=0}

function compliant_1(){

        let bigint = 41234563232789012327892787227897329n; //compliant since using a bigint & n
        console.log(bigint);
    }
     // {/fact}