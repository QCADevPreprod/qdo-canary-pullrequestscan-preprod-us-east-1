################################################################################
# Dynamic action to restart mysqld process and wait for sometime for engine to
# come up and report health status
# Standalone script that can be reused
################################################################################
echo "Killing mysqld process and verifying that it has successfully started back up"
# Restart mysqld process
mysqldPid=$(pgrep mysqld)

# corner case: mysqld process doesn't exist in the begining
if [ -z "$mysqldPid" ]; then
    echo "mysqld process doesn't exist in the begining."
    echo "Please make sure HM is enabled to restart mysqld successfully."
    exit 0
fi

if sudo kill -9 $mysqldPid ; then
    echo "mysqld process killed."
    echo "old mysqld process id: $mysqldPid"
else
    echo "Error in killing mysqld process."
    echo "Aborting..."
    exit 1
fi

# wait for 3 seconds here for pkill command
sleep 3

echo "Wait until mysqld process come up again."
iteration=4
for (( iter = 0; iter < $iteration; ++iter )); do
    mysqldPid=$(pgrep mysqld)
    if [ -z "$mysqldPid" ]; then
        sleep 5
        secs=$(( 5* $(( iter+1 )) ))
        echo "Waited $secs seconds."
    else
        echo "mysqld process is up."
        echo "new mysqld process id: $mysqldPid"
        break
    fi
done

if [ "$iter" == "$iteration" ]; then
    timeoutValue=$(( 5*iter ))
    echo "Timeout in waiting for mysqld process to start again. Timeout value: $timeoutValue seconds."
    echo "Aborting..."
    exit 1
fi
