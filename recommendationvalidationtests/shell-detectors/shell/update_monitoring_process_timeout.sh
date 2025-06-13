#################################################################
# Dynamic action to UPDATE or DELETE following values in /rdsdbdata/rds-metadata/dbInstance.properties:
# BootstrapProgressIndicationDuringMvuTimeout=<VALUE_FROM_1_TO_3600>
# BootstrapProgressIndicationTimeout=<VALUE_FROM_1_TO_3600>
#
# This dynamic action performs following steps:
# 1. Creates backup file as /rdsdbdata/rds-metadata/dbInstance-dynamicaction.dynamicaction
# 2. When ACTION set to:
#   - 'UPDATE': update both entries in dbInstance.properties file. The DA will delete existing entries first if needed and then append new entries to the bottom. You are also required to provide a 'TIMEOUT_VALUE' as integer in range of 1-3600
#   - 'DELETE': delete both entries in file
#   - 'PRINT': print current dbInstance.properties file content.
############################################################
ACTION=:ACTION
TIMEOUT_VALUE=:TIMEOUT_VALUE

dbInstanceProperties="/rdsdbdata/rds-metadata/dbInstance.properties"
dbInstancePropertiesBackup="/rdsdbdata/rds-metadata/dbInstance-dynamicaction.dynamicaction" # Backup path
dbInstancePropertiesCopy="/rdsdbdata/rds-metadata/dbInstance-daUpdateCopy.properties"   # A copy while performing modification
mvuTimeoutParam="BootstrapProgressIndicationDuringMvuTimeout"
genericTimeoutParam="BootstrapProgressIndicationTimeout"
line_1="$mvuTimeoutParam=$TIMEOUT_VALUE"
line_2="$genericTimeoutParam=$TIMEOUT_VALUE"

backup_file(){
    echo "------------------------------------------------------------------------------"
    echo "Starting backup process for '$dbInstanceProperties'..."
    # Call DA to create backup file of /rdsdbdata/rds-metadata/dbInstance.properties, the backup file would be created with the name /rdsdbdata/rds-metadata/dbInstance-dynamicaction.properties
    #- backup_file.sh {"original_file_path": "$dbInstanceProperties", "backup_file_path": "$dbInstancePropertiesBackup", "overwrite": "1"}
    echo "------------------------------------------------------------------------------"
}

print_file(){
    echo -e "\nPrinting the content of '$dbInstanceProperties'..."
    echo "\`\`\`"
    cat $dbInstanceProperties
    echo "\`\`\`"
}

cleanup_entries(){
    backup_file
    echo -e "Updating ...\n"
    sudo sed -i "/^$mvuTimeoutParam=/d" $dbInstanceProperties
    sudo sed -i "/^$genericTimeoutParam=/d" $dbInstanceProperties
}

append_entries(){
    cleanup_entries
    sudo cp -p $dbInstanceProperties $dbInstancePropertiesCopy
    if [[ $? -eq 0 ]]; then
        sudo sed -i "\$a$line_1" $dbInstancePropertiesCopy
        sudo sed -i "\$a$line_2" $dbInstancePropertiesCopy
        sudo mv $dbInstancePropertiesCopy $dbInstanceProperties
        if [[ $? -ne 0 ]]; then
            echo "Error: Something went wrong with moving $dbInstancePropertiesCopy that contains new entries to $dbInstanceProperties. Aborting..."
            exit 1
        fi
    else
        echo "Error: Something went wrong with copying $dbInstanceProperties to $dbInstancePropertiesCopy while appending entries. Aborting..."
        exit 1
    fi
}

verify_entries_exist(){
    echo
    if grep -e "^$mvuTimeoutParam=" -e "^$genericTimeoutParam=" $dbInstanceProperties; then
        echo "**** Confirmed that Entries are present in the file now! ****"
    else
        echo "**** Confirmed that Entries are NOT present in the file now! ****"
    fi
}

main(){
    if [[ "$ACTION" == "UPDATE" ]]; then
        echo "Confirmed ACTION is set to 'UPDATE'. Adding following entries to file '$dbInstanceProperties':"
        echo -e "$line_1\n$line_2\n\n"
        if [[ $TIMEOUT_VALUE =~ ^[1-9][0-9]{0,3}$ && $TIMEOUT_VALUE -ge 1 && $TIMEOUT_VALUE -le 3600 ]]; then
            echo "Confirmed TIMEOUT_VALUE '$TIMEOUT_VALUE' is valid!"
            print_file
            echo
            append_entries
        else
            echo "**** ERROR: the TIMEOUT_VALUE '$TIMEOUT_VALUE' is invalid! Please provide an integer in range of 1 to 3600. ****"
            echo "The DA will not perform any action."
        fi
    elif [[ "$ACTION" == "DELETE" ]]; then
        echo "Confirmed ACTION is set to 'DELETE'. Deleting following entries from file '$dbInstanceProperties':"
        echo -e "BootstrapProgressIndicationDuringMvuTimeout\nBootstrapProgressIndicationTimeout\n\n"
        print_file
        echo
        cleanup_entries
    elif [[ "$ACTION" == "PRINT" ]]; then
        echo "Confirmed ACTION is set to 'PRINT'. The DA will print the content of '$dbInstanceProperties' and not perform any write action."
    else
        echo "Invalid ACTION! The DA will not perform any action."
        echo -e "\n - 'UPDATE' to update both entries with a 'TIMEOUT_VALUE' value.\n - 'DELETE' to delete both entries.\n - 'PRINT' to print current dbInstance.properties file content."
        exit 0
    fi
    verify_entries_exist
    print_file
}
main
