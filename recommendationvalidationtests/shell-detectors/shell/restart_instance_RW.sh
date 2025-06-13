################################################################################
# Likely, both instances will be RO and in crash loop. With this dynamic action
# we change the open-mode of this instance to RW, to change instance to
# writer instance.
#
# 1. Change volume option file to RW. Update time in timestamp file.
# 2. Restart instance by manually killing mysqld so HM brings instance back up.
# 3. Check error logs to check if the instance opened grover in RW mode.
################################################################################

echo "Executing dynamic action to make reader instance into writer instance"

printErrorLog=:printErrorLog
sleepTimeSeconds=:sleepTimeSeconds

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

# Update $volumeOptionFile file setting to RW
echo
echo "Updating $volumeOptionFile file"
if sudo sed -i 's/RO/RW/' $volumeOptionFile ; then
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
    echo "Could not kill pid: $mysqldPid, exiting script."
    exit 1
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

    # Check error logs to see if grover volume opened in RW mode.
    # Should show something like "Grover volume options: ..."openMode" : "RW",...".
    # If not, then run this script again.
    echo
    echo "Checking error logs to see if grover (Grover volume options) opened in RW mode (CHECK MOST RECENT LINES):"
    echo "Please check for string below (in last 2 lines): 'openMode : RW'"
    echo
    if grep "openMode" $errLog ; then
        echo
        echo "Done dynamic action."
        echo "If instance hasn't changed to RW, then run this dynamic action again."
    else
        echo "Could not grep $errLog, exiting script."
    fi
else
    echo
    echo "printErrorLog is not set, so we are not grepping the error log here. Exiting script."
    exit 1
fi
