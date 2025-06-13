###############################################################################
# This dynamic action changes the open-mode of this instance to RO or RW, to change
# instance to reader instance.
#
# 1. Change volume option file to RO or RW. Update time in timestamp file.
# 2. Restart instance by manually killing mysqld so HM brings instance back up.
# 3. Check error logs to check if the instance opened grover in correct mode.
# 4. :RO_or_RW = Enter RO for read only or RW for read write state.
###############################################################################

printErrorLog=:printErrorLog
sleepTimeSeconds=:sleepTimeSeconds
RO_or_RW=:RO_or_RW

if [ "$RO_or_RW" = "RO" ]; then
  toggle_cmd='s/RW/RO/'
elif [ "$RO_or_RW" = "RW" ]; then
  toggle_cmd='s/RO/RW/'
else
  echo "Wrong value provided in RO_or_RW parameter. Enter RO for read only or RW for read write."
  exit 1
fi

echo "Executing dynamic action to make instance switch to $RO_or_RW state."

# Files we are interacting with
daCopyExtension="dynamicaction"
volumeOptionFile="/etc/rds/data_volume_option_str"
daVolumeOptionFileCopy="$volumeOptionFile.$daCopyExtension"
timeStampFile="/etc/rds/data_volume_timestamp_str"
daTimeStampFileCopy="$timeStampFile.$daCopyExtension"
errLog="/rdsdbdata/log/error/mysql-error.log"

# Make a backup of $volumeOptionFile
if sudo cp $volumeOptionFile $daVolumeOptionFileCopy ; then
    echo "Successfully made backup of $volumeOptionFile to $daVolumeOptionFileCopy"
else
    echo "Failed to make backup of $volumeOptionFile to $daVolumeOptionFileCopy, exiting"
    exit 1
fi

# Make a backup of $timeStampFile
if sudo cp $timeStampFile $daTimeStampFileCopy ; then
    echo "Successfully made backup of $timeStampFile to $daTimeStampFileCopy"
else
    echo "Failed to make backup of $timeStampFile to $daTimeStampFileCopy, exiting"
    exit 1
fi

# Update $volumeOptionFile file setting to RO or RW
echo
echo "Updating $volumeOptionFile file"

if sudo sed -i $toggle_cmd $volumeOptionFile ; then
    printf "Old Options: %s\n" "$(cat $daVolumeOptionFileCopy)"
    printf "New Options: %s\n" "$(cat $volumeOptionFile)"
else
    echo "Could not alter config file $volumeOptionFile, exiting script."
    exit 1
fi

# Update $timeStampFile with the current time
echo
echo "Updating $timeStampFile file"
if printf "%s" $(($(date +%s%N)/1000000)) | sudo tee $timeStampFile > /dev/null ; then
    printf "Old timestamp: %s\n" "$(cat $daTimeStampFileCopy)"
    printf "New timestamp: %s\n" "$(cat $timeStampFile)"
    echo
else
    echo "Could not alter config file $timeStampFile, exiting script."
    exit 1
fi

# Kill mysqld so Host Manager will restart the instance
mysqldPid=`/sbin/pidof mysqld`
echo "Attempting to kill mysqld and restart instance"
echo "Killing pid: $mysqldPid"
if sudo kill -9 $mysqldPid ; then
    echo "Successfully killed pid: $mysqldPid"
else
    echo "Could not kill pid: $mysqldPid, mysqld has been killed already."
fi

# If this value is set, then we check the error logs.
if [ "$printErrorLog" != "" ] && [ $printErrorLog != "false" ] ; then
    # Wait a couple of seconds so that instance comes up
    # and we can read error logs to check how volume opened
    if [ "$sleepTimeSeconds" != "" ] ; then
        sleepTime=$sleepTimeSeconds
    else
        sleepTime=5
    fi
    echo "Sleeping for $sleepTime seconds"
    sleep $sleepTime

    # Check error logs to see if grover volume opened in the specified mode.
    # Should show something like "Grover volume options: ..."openMode" : "RW",..." for read write state.
    # If not, then run this script again.
    echo
    echo "Checking error logs to see if grover (Grover volume options) opened in $RO_or_RW mode (CHECK MOST RECENT LINES):"
    echo "Please check for string below (in last 2 lines): 'openMode : $RO_or_RW'"
    echo
    if grep "openMode" $errLog ; then
        echo
        echo "Done dynamic action."
        echo "If instance hasn't changed its state, then run this dynamic action again."
    else
        echo "Could not grep $errLog, exiting script."
    fi
else
    echo
    echo "printErrorLog is not set, so we are not grepping the error log here."
fi