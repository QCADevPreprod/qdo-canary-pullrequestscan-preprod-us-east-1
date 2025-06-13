const { Signale } = require('signale');

// {fact rule=logging-of-sensitive-information@v1.0 defects=1}

function do_not_log_confidential_information_noncompliant()
{
    const opts = {
        disabled: false,
        interactive: false,
        logLevel: 'info',
        scope: 'custom',
        // Noncompliant: Empty list is assigned to secrets
        secrets: []
    };

    const logger = new Signale(opts);
    logger.log('Secret is: ', info);
}
// {/fact}

// {fact rule=logging-of-sensitive-information@v1.0 defects=0}

function do_not_log_confidential_information_compliant()
{
    const opts = {
        disabled: false,
        interactive: false,
        logLevel: 'info',
        scope: 'custom',
        // Compliant: Pattern for secret is configured and hence will not be logged
        secrets: ["[1-9]{10}"]
    };

    const logger = new Signale(opts);
    logger.log('Secret is: ', info);
}
// {/fact}

