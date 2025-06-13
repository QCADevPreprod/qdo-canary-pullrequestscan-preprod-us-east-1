################################################################################
# Dynamic action to restart csdd process and wait for sometime for engine to
# come up and report health status
# Standalone script that can be reused
################################################################################
echo "Killing csdd process and verifying that it has successfully started back up"
# Restart csdd process
csddPid=$(pgrep csdd)

# corner case: csdd process doesn't exist in the begining
if [ -z "$csddPid" ]; then
    echo "csdd process doesn't exist in the begining."
    echo "Please make sure HM is enabled to restart csdd successfully."
    exit 0

if sudo kill -9 $csddPid ; then
    echo "csdd process killed."
    echo "old csdd process id: $csddPid"
else
    echo "Error in killing csdd process."
    echo "Aborting..."
    exit 1
fi

# wait for 3 seconds here for pkill command
sleep 3

echo "Wait until csdd process come up again."
iteration=4
for (( iter = 0; iter < $iteration; ++iter )); do
    csddPid=$(pgrep csdd)
    if [ -z "$csddPid" ]; then
        sleep 5
        secs=$(( 5* $(( iter+1 )) ))
        echo "Waited $secs seconds."
    else
        echo "csdd process is up."
        echo "new csdd process id: $csddPid"
        break
    fi
done

if [ "$iter" == "$iteration" ]; then
    timeoutValue=$(( 5*iter ))
    echo "Timeout in waiting for csdd process to start again. Timeout value: $timeoutValue seconds."
    echo "Aborting..."
    exit 1
fi
