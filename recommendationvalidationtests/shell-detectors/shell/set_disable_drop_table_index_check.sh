###############################################################################
# Dynamic Action to Enable/Disable internal knob aurora_disable_innodb_drop_table_index_check only if version is greater than or equal to 2.07.5.
# Parameters:
##      - ON_OFF: Put On/1/True to enable knob and Off/0/False to disable. The DA will only show current variable settings on other/empty values.
##############################################################################
declare -l ON_OFF
ON_OFF=:ON_OFF
export LD_LIBRARY_PATH=/rdsdbbin/oscar/lib
MYSQL_CLIENT_CMD="/rdsdbbin/oscar/bin/mysql -urdsadmin"

verify_version(){
    auroraVersion=$(${MYSQL_CLIENT_CMD} -N -e "SELECT @@aurora_version;")
    echo -e "AURORA VERSION: $auroraVersion\n"

    IFS='.' read -a versionSplits <<< "$auroraVersion"
    major="${versionSplits[0]}"
    minor="${versionSplits[1]}"
    patch="${versionSplits[2]}"

    if [[ "$major" -eq 2 ]] && [[ 10#"$minor" -gt 7 || ( 10#"$minor" -eq 7 && "$patch" -ge 5 ) ]]; then
        echo -e "\nConfirmed @@aurora_version >= 2.07.5\n"
    else
        echo "ERROR due to one of the following:"
        echo "    1) Aurora Version is not 2.0 or is less than 2.07.5 which doesn't contain the knob aurora_disable_innodb_drop_table_index_check. Please upgrade to at least 2.07.5 version and try again."
        echo "        a) Reachout template: https://sim.amazon.com/issues/AURORA-23244?selectedConversation=b277b943-56c4-40c7-b5a6-84a1dc579ff4"
        echo "    2) DA is not able to access the database or engine is crashing."
        echo -e "\nThis DA will not perform any action. Exiting..."
        exit 0
    fi
}

show_knob_value(){
    show_variable_sql="show global variables like 'aurora_disable_innodb_drop_table_index_check';"
    knob_value=($(${MYSQL_CLIENT_CMD} -N -e "${show_variable_sql}"))
    echo "SHOW CURRENT GLOBAL VARIABLE:"
    ${MYSQL_CLIENT_CMD} -t -e "${show_variable_sql}"
}

verify_knob_change(){
    show_knob_value
    if [[ "${knob_value[1]}" == "${knobValue}" ]]; then
        echo -e "\nDA Succeeded!"
    else
        echo -e "\nERROR: Value of aurora_disable_innodb_drop_table_index_check has not changed, please try running DA again. Exiting..."
        exit 1
    fi
}

set_knob_value(){
    echo -e "Setting aurora_disable_innodb_drop_table_index_check value to $knobValue at global level ...\n"
    ${MYSQL_CLIENT_CMD} -t -e "${set_variable_sql}"
    verify_knob_change
}

main(){
    verify_version
    if [[ "$ON_OFF" == "off" ]] || [[ "$ON_OFF" == "0" ]] || [[ "$ON_OFF" == "false" ]]; then
        inputValue="OFF"
    elif [[ "$ON_OFF" == "on" ]] || [[ "$ON_OFF" == "1" ]] || [[ "$ON_OFF" == "true" ]]; then
        inputValue="ON"
    else
        inputValue=""
    fi

    set_variable_sql="set global aurora_disable_innodb_drop_table_index_check = $inputValue;"
    
    if [[ -z "$inputValue" ]]; then
        show_knob_value
        echo -e "\nPlease set ON/1/TRUE or OFF/0/FALSE to change value of aurora_disable_innodb_drop_table_index_check."
        echo "This DA will not perform any action. Exiting..."
    else
        set_knob_value
    fi
}
main