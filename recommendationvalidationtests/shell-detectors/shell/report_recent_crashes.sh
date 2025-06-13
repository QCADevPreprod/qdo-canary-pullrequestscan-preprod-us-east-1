##################################################################################################################
# Diagnostic DA to report_recent_crashes
# Performs the following steps:
#    - filepath: rdsdbdata/processed-core-dumps/mysqld-pstack*
#    - prints all unique thread stacktrace during crash i.e 2nd line of each crash in the last 30 minute before and after the timestamp
#    - if timestamp is empty - print all unique thread stacktrace during crash within last 60 minute
#    - It prints last 5 unique thread stacks
# Parameter:
# timeStamp of the issue occurrence should be in the format of 'yyyy-mm-dd hh:mm' UTC
# timeStamp is optional
##################################################################################################################
timeStamp=:timeStamp
mysqldPstackPath="/rdsdbdata/processed-core-dumps/mysqld-pstack*"
csddPstackPath="/rdsdbdata/processed-core-dumps/csdd-pstack*"

evaluateTimestamp() {
    # convert timestamp to time since epoch
    regexMinute="^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2})$"
    # if timeStamp is empty, take current timestamp value
    if [[ "$timeStamp" == "" ]] ; then
        echo "Taking current timestamp value since timeStamp was not provided"
        timeStamp=$(date +"%Y-%m-%d %H:%M")
        echo -e "timestamp considered is $timeStamp UTC"
        mysqldPstackFilesWithOutTimeStamp
        csddPstackfilesWithOutTimeStamp
    elif [[ "$timeStamp" =~ $regexMinute ]] ; then
        echo -e "Input timestamp is $timeStamp UTC"
        epochTimestamp=`date --date="${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]} ${BASH_REMATCH[4]}:${BASH_REMATCH[5]}:00" "+%s"`
        mysqldPstackFilesWithTimeStamp
        csddPstackFilesWithTimeStamp
    else
        echo "Timestamp is in wrong format" 1>&2
        echo "Please provide timeStamp in the format of 'yyyy-mm-dd hh:mm' UTC"
        echo "Aborting..." 1>&2
        exit 1
    fi
}

mysqldPstackFilesWithTimeStamp(){
    mysqldPstackFiles=$(findPstacksWithTimeStamp "$mysqldPstackPath")
    if [[ ${#mysqldPstackFiles} -eq 0 ]] ; then
        echo -e "mysqld-pstack files were not found before or after 30 minutes of the given timestamp"
    else
        echo -e "*************************************************************************"
        echo -e "mysqld-pstack files found before and after 30 minutes of the given timestamp"
        echo -e "$mysqldPstackFiles"
    fi
}

csddPstackFilesWithTimeStamp(){
    csddPstackFiles=$(findPstacksWithTimeStamp "$csddPstackPath")
    if [[ ${#csddPstackFiles} -eq 0 ]] ; then
        echo -e "csdd-pstack files were not found before or after 30 minutes of the given timestamp"
    else
        echo -e "*************************************************************************"
        echo -e "csdd-pstack files found before and after 30 minutes of the given timestamp"
        echo -e "$csddPstackFiles"
    fi
}

mysqldPstackFilesWithOutTimeStamp(){
    mysqldPstackFiles=$(findPstacksWithOutTimeStamp "/rdsdbdata/processed-core-dumps" "mysqld-pstack*")
    if [[ ${#mysqldPstackFiles} -eq 0 ]] ; then
        echo -e "mysqld-pstack files were not found within last 60 minutes of the current timestamp"
    else
        echo -e "*************************************************************************"
        echo -e "mysqld-pstack files found within last 60 minutes of the current timestamp"
        echo -e "$mysqldPstackFiles"
    fi
}

csddPstackfilesWithOutTimeStamp(){
    csddPstackFiles=$(findPstacksWithOutTimeStamp "/rdsdbdata/processed-core-dumps" "csdd-pstack*")
    if [[ ${#csddPstackFiles} -eq 0 ]] ; then
        echo -e "csdd-pstack files were not found within last 60 minutes of the current timestamp"
    else
        echo -e "*************************************************************************"
        echo -e "csdd-pstack files found within last 60 minutes of the current timestamp"
        echo -e "$csddPstackFiles"
    fi
}


findPstacksWithTimeStamp() {
    # get a list of all pstacks generated in the range of +-30 minutes
    pstackPath="$1"
    # shellcheck disable=SC2012
    pstackFiles=()
pstackFiles+=$(ls -1 $pstackPath | \
awk -v ts="$epochTimestamp" --posix 'match($0,"[0-9]{4}(-[0-9]{2}){5}")'\
'{
    leading_str=substr($0,0,RSTART-1);
    time_str=substr($0,RSTART,RLENGTH);
    trailing_str=substr($0,RSTART+RLENGTH);
    split(time_str,time_deliminated,"-");
    cmd="date --date=\"" time_deliminated[1] "-" time_deliminated[2] "-" time_deliminated[3] " " time_deliminated[4] ":" time_deliminated[5] ":" time_deliminated[6] "\" \"+%s\"";
    cmd | getline epoch_time;
    close(cmd);
    if (epoch_time >= (ts-1800) && epoch_time <= (ts+1800))
        print leading_str time_str trailing_str
}')
    echo "$pstackFiles"
}


findPstacksWithOutTimeStamp() {
    # get a list of all pstacks generated in the range of -60 minutes
    pstackFiles=()
    pstackFiles+=`find $1 -cmin -60 -iname "$2" -exec ls -1  {} \;`
    echo "$pstackFiles"
}

findUniqueCrashes()
{
    echo -e "*************************************************************************"
    echo -e "Now considering files found in $2"
    echo -e "$1"
    echo -e "--------------------------------------------------------------------"
    parsePstackFiles $1
    displayThreads $1 | awk -F "%" '{print $3}'  | tail -n +2  | sort -u > unique_thread_stack
    echo -e "There are $(awk 'END { print NR }' unique_thread_stack) unique running thread stacktrace during crash"
    nl -s "." unique_thread_stack
    sudo rm unique_thread_stack
}

displayThreads() {
    strings "$1" \
        | head -n "$summary_line_included" \
        | tail -n "$total_thread_lines" \
        | tr '\n' '%' \
        | sed 's/--------------------  thread/@/g' \
        | tr '@' '\n' 
}

parsePstackFiles() {
    #line number where threads starts
    thread_start=`strings $1|grep -n "\--------------------  thread"|head -1|awk -F ":" '{print $1}'` 
    #line number where summary starts
    summary_start=`strings $1|grep -n "\--------------------  summary"|tail  -1|awk -F ":" '{print $1}'`
    #this to include summary line also so we can trim it
    summary_line_included=$(($summary_start+1))
    #total number of line of threads
    total_thread_lines=$(($summary_start - $thread_start + 1))
}

findLastFiveUniqueOffendingStacks()
{
    file_name=$(ls -t1 $1 | head -n1)
    echo -e "********************************************************"
    echo -e "The latest $2 file is $file_name"
    echo
    parsePstackFiles $file_name
    #total no. of thread in file
    total_thread_count=`strings $file_name|grep -n "\--------------------  thread"|wc -l`
    thread_count=5
    while [[ $thread_count -le $total_thread_count ]]
    do
        total_unique_threads=$(displayThreads "$file_name"| awk -F '--------------------' '{print $2 "----------"}' | uniq | tail -$thread_count|sort -u | wc -l)
        if [[ $total_unique_threads = 5 ]] ; then
            echo "The last five unique thread stacks:"
            echo "----------------------------------------------------------------"
            displayThreads "$file_name"| awk -F '--------------------' '{print $2 "----------"}'|uniq|tail -$thread_count|sort -u|tr '%' '\n'
            break
        else
            thread_count=$(($thread_count+1))
        fi
    done
}

main() {
    evaluateTimestamp
    if [[ ${#mysqldPstackFiles} -eq 0  && ${#csddPstackFiles} -eq 0 ]]; then
        echo -e "No files are found in given timestamp"
        echo -e "exiting"
        exit
    else
        findUniqueCrashes "$mysqldPstackFiles" "mysqld-pstack"
        findUniqueCrashes "$csddPstackFiles" "csdd-pstack"
        findLastFiveUniqueOffendingStacks "$mysqldPstackFiles" "mysqld-pstack"
        findLastFiveUniqueOffendingStacks "$csddPstackFiles" "csdd-pstack"
    fi
 }

 main