exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    lambda_do_not_override_env_variable_noncompliant();
    lambda_do_not_override_env_variable_compliant();
    return context.logStreamName;
}

// {fact rule=lambda-override-reserved@v1.0 defects=1}
function lambda_do_not_override_env_variable_noncompliant()
{
    // Noncompliant: Environment variables are overriden
    process.env.AWS_REGION = "us-east-1";
}

// {/fact}

// {fact rule=lambda-override-reserved@v1.0 defects=0}
function lambda_do_not_override_env_variable_compliant()
{
    // Compliant: Environment variables are not overriden
    if(process.env.AWS_REGION === 'some value')
    {
        //some operation
    }
}
// {/fact}