################################################################################
# Dynamic Action to update mysql.rds_set_configuration procedure and set the binlog retention period between 1 and 2160 inclusive.
# Created for AURORA-41876 to automate full mitigation
# Performs the following steps:
##     - Check if the input parameter is empty.
##     - Check if the input parameter is a number.
##     - Update mysql.rds_set_configuration procedure.
##     - Set the binlog retention period if the input parameter is a number.
# Parameters:
##     retention_hours: (optional) Set the binlog retention period from 1 up to 2160 hours (90 days) if retention_hours is a number.
################################################################################
export LD_LIBRARY_PATH=/rdsdbbin/oscar/lib

# Check if the input parameter is empty
# Check if the input parameter is a number
retention_hours=:retention_hours
is_number_regex='^[0-9]+$'
if [ -z "$retention_hours" ]; then
    echo "retention_hours is empty. The binlog retention period will not be set." 
elif ! [[ $retention_hours =~ $is_number_regex ]] ; then
    echo "ERROR: retention_hours is not a number" 1>&2
    exit 1
fi

# Create temporary queries_to_execute.sql script
cat << \EOF > /tmp/queries_to_execute.sql

SET SESSION sql_log_bin = 0;
use mysql;
show create procedure mysql.rds_set_configuration\G
DROP PROCEDURE IF EXISTS `mysql`.`rds_set_configuration`;
DELIMITER //
CREATE DEFINER=`rdsadmin`@`localhost` PROCEDURE `rds_set_configuration`(IN name VARCHAR(30), IN value INT)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE sql_logging BOOLEAN;

    IF name = 'binlog retention hours' AND value NOT BETWEEN 1 AND 2160 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'For binlog retention hours the value must be between 1 and 2160 inclusive or be NULL';
    END IF;

    SELECT @@sql_log_bin INTO sql_logging;
    SET @@sql_log_bin = OFF;
    UPDATE mysql.rds_configuration
    SET mysql.rds_configuration.value = value
    WHERE BINARY mysql.rds_configuration.name = BINARY name;
    SET @@sql_log_bin = sql_logging;
END
//
DELIMITER ;
show create procedure mysql.rds_set_configuration\G

EOF

# Set the binlog retention period if retention_hours is a number
if [[ $retention_hours =~ $is_number_regex ]] ; then
# Update temporary queries_to_execute.sql script
cat << EOF >> /tmp/queries_to_execute.sql
call mysql.rds_set_configuration('binlog retention hours', ${retention_hours});
call mysql.rds_show_configuration;

EOF
fi

# Running queries_to_execute.sql file on customer db
/rdsdbbin/oscar/bin/mysql -u rdsadmin -t -e 'source /tmp/queries_to_execute.sql'

# Removing temporary queries_to_execute.sql script
rm /tmp/queries_to_execute.sql