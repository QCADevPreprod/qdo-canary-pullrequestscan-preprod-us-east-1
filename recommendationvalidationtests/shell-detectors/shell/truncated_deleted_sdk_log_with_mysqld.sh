################################################################################
# Dynamic Action to find and truncate the DELETED aurora_aws_sdk log files that have open file descriptors with mysqld process.
# This DA can be used to free space
# Created for AURORA-38839 SOP as temporary mitigation
# Parameters:
##     CONFIRM_DELETE: Confirm to truncate files, only perform when set to true.
##     SANDBOX_ENABLED: Confirm Sanbox has enabled or not on instance page (true/false), sdk logs path will be different.
# Find deleted files: 
## pgrep mysqld | sudo xargs -IX sudo find /proc/X/fd -lname '/rdsdbdata/db/aurora_aws_sdk_*(deleted)'     -printf '%p => %l\t' -exec stat -Lc '%s Byte'   {} \; 2>/dev/null
# Truncate files:
## pgrep mysqld | sudo xargs -IX find /proc/X/fd -lname '/rdsdbdata/db/aurora_aws_sdk_*(deleted)'  -exec truncate -s 0 {} +
##
## For Sandbox enabled instance, the path should be '/rdsroot/rdsdbdata/db/aurora_aws_sdk_*(deleted)'
################################################################################
declare -l CONFIRM_DELETE
declare -l SANDBOX_ENABLED
CONFIRM_DELETE=:CONFIRM_DELETE
SANDBOX_ENABLED=:SANDBOX_ENABLED
print_file_list_and_size()
{
    output=$(pgrep mysqld | sudo xargs -IX sudo find /proc/X/fd -lname $sdkLogPath -printf '%p => %l\t' -exec stat -Lc '%s Byte' {} \; 2>/dev/null)
    echo "---------------------------------------------------------"
    echo "Printing deleted aurora_aws_sdk log files with file descriptors from the mysqld process..."
    echo $output
    echo "---------------------------------------------------------"
}

main(){
    if [[ "$SANDBOX_ENABLED" == "true" ]] ; then
        echo -e "Confirmed SANDBOX_ENABLED is set to true\n"
        sdkLogPath="/rdsroot/rdsdbdata/db/aurora_aws_sdk_*(deleted)"
    elif [[ "$SANDBOX_ENABLED" == "false" ]] ; then
        echo -e "Confirmed SANDBOX_ENABLED is set to false\n"
        sdkLogPath="/rdsdbdata/db/aurora_aws_sdk_*(deleted)"
    else
        echo "SANDBOX_ENABLED is not set to true or false. Please check Sandbox Enabled value from the instance page. No truncate operation performed."
        echo "Exiting..."
        exit 1
    fi

    print_file_list_and_size

    if [[ "$CONFIRM_DELETE" == "true" ]] ; then
        if [[ $output ]]; then
            echo "Truncating deleted aurora_aws_sdk log files with file descriptors from the mysqld process..."
            pgrep mysqld | sudo xargs -IX find /proc/X/fd -lname $sdkLogPath  -exec truncate -s 0 {} +
            if [[ $? -eq 0 ]] ; then
                echo "TRUNCATE SUCCEEDED"
                print_file_list_and_size
                echo "Checking disk space...(df -h)"
                df -h /rdsdbdata/db
            else
                echo "ERROR: TRUNCATE FAILED"
                exit 1
            fi
        else
            echo "Deleted aurora_aws_sdk log files with file descriptors via the mysqld process NOT found. No truncate operation performed."
            echo "Exiting..."
            exit 1
        fi
    else
        echo "CONFIRM_DELETE is not set to true. No truncate operation performed."
    fi
}
main