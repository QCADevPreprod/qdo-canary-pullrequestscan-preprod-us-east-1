#################################################################
# Dynamic action to UPDATE or DELETE following values in /rdsdbdata/config/my.cnf.template:
# aurora_memory_recovery_enable_tune_cache = '<ON/OFF>'
# aurora_memory_recovery_enable_lock_reject = '<ON/OFF>'
# aurora_memory_recovery_enable_decline = '<ON/OFF>'
# aurora_memory_recovery_enable_kill_query = '<ON/OFF>'
#
# This dynamic action performs following steps:
# 1. Creates backup file as /rdsdbdata/config/my-cnf-template.dynamicaction
# 2. When ACTION set to:
#   - 'UPDATE': update all entries in my.cnf.template file. The DA will delete existing entries first if needed and then append new entries to the bottom. You are also required to provide a 'KNOB_VALUE' with either ON or OFF
#   - 'DELETE': delete all entries in file
#   - 'PRINT': print current my.cnf.template file content.
############################################################
ACTION=:ACTION
KNOB_VALUE=:KNOB_VALUE

myCnfTemplate="/rdsdbdata/config/my.cnf.template"
myCnfTemplateBackup="/rdsdbdata/config/my-cnf-template.dynamicaction" # Backup path
myCnfTemplateCopy="/rdsdbdata/config/my-cnf-template.daUpdateCopy"   # A copy while performing modification

auroraMemoryRecoveryEnableTuneCache="aurora_memory_recovery_enable_tune_cache"
auroraMemoryRecoveryEnableLockReject="aurora_memory_recovery_enable_lock_reject"
auroraMemoryRecoveryEnableDecline="aurora_memory_recovery_enable_decline"
auroraMemoryRecoveryEnableKillQuery="aurora_memory_recovery_enable_kill_query"

line_1="$auroraMemoryRecoveryEnableTuneCache = '$KNOB_VALUE'"
line_2="$auroraMemoryRecoveryEnableLockReject = '$KNOB_VALUE'"
line_3="$auroraMemoryRecoveryEnableDecline = '$KNOB_VALUE'"
line_4="$auroraMemoryRecoveryEnableKillQuery = '$KNOB_VALUE'"

backup_file(){
    echo "------------------------------------------------------------------------------"
    echo "Starting backup process for '$myCnfTemplate'..."
    # Call DA to create backup file of /rdsdbdata/config/my.cnf.template, the backup file would be created with the name /rdsdbdata/config/my-cnf-template.dynamicaction
    #- backup_file.sh {"original_file_path": "$myCnfTemplate", "backup_file_path": "$myCnfTemplateBackup", "overwrite": "1"}
    echo "------------------------------------------------------------------------------"
}

print_file(){
    echo -e "\nPrinting the content of '$myCnfTemplate'..."
    echo "\`\`\`"
    cat $myCnfTemplate
    echo "\`\`\`"
}

cleanup_entries(){
    backup_file
    echo -e "Updating ...\n"
    sudo sed -i "/^$auroraMemoryRecoveryEnableTuneCache =/d" $myCnfTemplate
    sudo sed -i "/^$auroraMemoryRecoveryEnableLockReject =/d" $myCnfTemplate
    sudo sed -i "/^$auroraMemoryRecoveryEnableDecline =/d" $myCnfTemplate
    sudo sed -i "/^$auroraMemoryRecoveryEnableKillQuery =/d" $myCnfTemplate
}

append_entries(){
    cleanup_entries
    sudo cp -p $myCnfTemplate $myCnfTemplateCopy
    if [[ $? -eq 0 ]]; then
        sudo sed -i "\$a$line_1" $myCnfTemplateCopy
        sudo sed -i "\$a$line_2" $myCnfTemplateCopy
        sudo sed -i "\$a$line_3" $myCnfTemplateCopy
        sudo sed -i "\$a$line_4" $myCnfTemplateCopy
        sudo mv $myCnfTemplateCopy $myCnfTemplate
        if [[ $? -ne 0 ]]; then
            echo "Error: Something went wrong with moving $myCnfTemplateCopy that contains new entries to $myCnfTemplate. Aborting..."
            exit 1
        fi
    else
        echo "Error: Something went wrong with copying $myCnfTemplate to $myCnfTemplateCopy while appending entries. Aborting..."
        exit 1
    fi
}

verify_entries_exist(){
    echo
    if grep -e "^$auroraMemoryRecoveryEnableTuneCache =" -e "^$auroraMemoryRecoveryEnableLockReject =" -e "^$auroraMemoryRecoveryEnableDecline =" -e "^$auroraMemoryRecoveryEnableKillQuery =" $myCnfTemplate; then
        echo "**** Confirmed that one or more Entries are present in the file now! ****"
    else
        echo "**** Confirmed that Entries are NOT present in the file now! ****"
    fi
}

main(){
    if [[ "$ACTION" == "UPDATE" ]]; then
        echo "Confirmed ACTION is set to 'UPDATE'. Adding following entries to file '$myCnfTemplate':"
        echo -e "$line_1\n$line_2\n$line_3\n$line_4\n\n"
        if [[ $KNOB_VALUE == "ON" || $KNOB_VALUE == "OFF" ]]; then
            echo "Confirmed KNOB_VALUE '$KNOB_VALUE' is valid!"
            print_file
            echo
            append_entries
        else
            echo "**** ERROR: the KNOB_VALUE '$KNOB_VALUE' is invalid! Please provide a value with either ON or OFF. ****"
            echo "The DA will not perform any action."
        fi
    elif [[ "$ACTION" == "DELETE" ]]; then
        echo "Confirmed ACTION is set to 'DELETE'. Deleting following entries from file '$myCnfTemplate':"
        echo -e "$auroraMemoryRecoveryEnableTuneCache\n$auroraMemoryRecoveryEnableLockReject\n$auroraMemoryRecoveryEnableDecline\n$auroraMemoryRecoveryEnableKillQuery\n"
        print_file
        echo
        cleanup_entries
    elif [[ "$ACTION" == "PRINT" ]]; then
        echo "Confirmed ACTION is set to 'PRINT'. The DA will print the content of '$myCnfTemplate' and not perform any write action."
    else
        echo "Invalid ACTION! The DA will not perform any action."
        echo -e "\n - 'UPDATE' to update all entries with a 'KNOB_VALUE' value.\n - 'DELETE' to delete all entries.\n - 'PRINT' to print current dbInstance.properties file content."
        exit 0
    fi
    verify_entries_exist
    print_file
}
main
