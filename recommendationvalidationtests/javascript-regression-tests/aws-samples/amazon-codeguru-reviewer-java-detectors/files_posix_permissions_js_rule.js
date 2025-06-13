// {fact rule=loose-file-permissions@v1.0 defects=1}

function files_posix_permissions_noncompliant()
{
    const fs = require('fs');
    // Noncompliant: Liberal file permissions are assigned to `others` class.
    fs.chmod("/tmp/filepath", 0o777);
}
// {/fact}

// {fact rule=loose-file-permissions@v1.0 defects=0}
function files_posix_permissions_compliant()
{
    const fs = require('fs');
    // Compliant: Liberal file permissions are not assigned to `others` class.
    fs.chmod("/tmp/filepath", 0o770);
}
// {/fact}
