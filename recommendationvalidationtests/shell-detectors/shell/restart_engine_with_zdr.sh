################################################################################
# Dynamic action to restart the instance with 'call action zero_downtime_restart(2);' 
# to save connections and report health status
################################################################################
export LD_LIBRARY_PATH=/rdsdbbin/oscar/lib
MYSQL_CLIENT_CMD="/rdsdbbin/oscar/bin/mysql -urdsadmin"
engineLog="/rdsdbdata/log/error/mysql-error.log"

print_latest_zdr_line_with_mark(){
    echo "....$1...."
    tac $engineLog | grep -m 1 "$1"
}

check_mysqld_health(){
    iteration=4
    for (( iter = 0; iter < $iteration; ++iter )); do
        mysqldPid=$(pgrep mysqld)
        if [[ -z "$mysqldPid" ]]; then
            sleep 5
            secs=$(( 5* $(( iter+1 )) ))
            echo "Waited $secs seconds."
        else
            echo "mysqld process is up."
            echo "new mysqld process id: $mysqldPid"
            
            echo -e "\n\n************************************************\n"
            echo -e "printing the latest ZDR markers in mysql-error.log...\n"
            print_latest_zdr_line_with_mark "ZDR Started"
            print_latest_zdr_line_with_mark "Count of user connections failed to be restored after restart"
            print_latest_zdr_line_with_mark "EZDR_COMPLETED"

            echo -e "\n\n************************************************\n"
            echo -e "printing last 100 lines of mysql-error.log...\n"
            tail -n 100 $engineLog
            break
        fi
    done

    if [[ "$iter" == "$iteration" ]]; then
        timeoutValue=$(( 5*iter ))
        echo "Timeout in waiting for mysqld process to start again. Timeout value: $timeoutValue seconds."
        echo "Aborting..."
        exit 1
    fi
}

main(){
    mysqldPid=$(pgrep mysqld)
    zdrCallAction="call action zero_downtime_restart(2);"

    echo "Restarting engine with ZDR and verifying that mysqld has successfully started back up"
    if [[ -z "$mysqldPid" ]]; then
        echo "mysqld process doesn't exist in the begining."
        echo "Please make sure HM is enabled to restart engine successfully."
        exit 0
    fi
    
    if ${MYSQL_CLIENT_CMD} -t -e "$zdrCallAction"; then
        echo "Engine restarted with ZDR - $zdrCallAction"
        echo "old mysqld process id: $mysqldPid"
    else
        echo "Error in $zdrCallAction"
        echo "Aborting..."
        exit 1
    fi
    echo "Wait until mysqld process come up again."
    sleep 3
    check_mysqld_health
}
main