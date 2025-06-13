################################################################################
# Dynamic Action to restart mysqld process or csdd process based on input parameters.
# Note: Customer permission required as restarting mysqld or csdd process will potentially cause some database downtime.
# Performs the following steps:
##     - Restart mysqld if RESTARTMYSQLD sets to true.
##     - Restart csdd if RESTARTCSDD sets to true.
##Parameters:
##     RESTARTMYSQLD: (True/False)Customer Approval to restart mysqld.
##     RESTARTCSDD: (True/False)Customer Approval to restart csdd.
################################################################################
declare -l RESTARTMYSQLD
declare -l RESTARTCSDD

RESTARTMYSQLD=:RESTARTMYSQLD
RESTARTCSDD=:RESTARTCSDD

function restart_mysql() {
    # Script to restart mysql
    # call restart mysqld Dynamic Action
    echo "Restarting mysqld..."
    #- restart_mysqld.sh {}
}

function restart_csd() {
    # Script to restart csd
    # call restart csdd Dynamic Action
    echo "Restarting csdd..."
    #- restart_csdd.sh {}
}

function main() {
    # Restart mysqld if RESTARTMYSQLD sets to true
    if [ "$RESTARTMYSQLD" == "true" ]; then
        restart_mysql
    else
        echo "RESTARTMYSQLD not set to true, the DA will not restart mysqld."
    fi
    echo -e ".................................................................\n"

    # Restart csdd if RESTARTCSDD sets to true.
    if [ "$RESTARTCSDD" == "true" ]; then
        restart_csd
    else
        echo "RESTARTCSDD not set to true, the DA will not restart csdd."
    fi    
    echo -e ".................................................................\n"

    echo "Dynamic Action ends here."
    echo -e "................................................................."
}
main
