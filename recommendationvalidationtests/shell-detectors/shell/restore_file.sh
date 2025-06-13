# >>>>>>>>>>>>>>>>>>>>>>>>>> Begin restore_file.sh >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# Standalone script for re-use in other DA scripts to restore a file from
# its backup (backup should have '.dynamicaction' extension).
# After restoring the original, the backup file is deleted.
#
# Note that this script does NOT perform a restart of any process after
# restoring the file.
#
# PARAMS
# ------------------------------------------------------------------------------
# file_to_restore_path  |  ABSOLUTE path to the file you want to revert/restore
#                       |  from its .dynamicaction backup file
#
# HOW TO USE IN ANOTHER DA
# ------------------------------------------------------------------------------
# Add the following line to your target script:
#     #- restore_file.sh {"file_to_restore_path": "<ABSOLUTE-PATH-TO-FILE>"}
#
# Line starting with #-, means it is invoking another Dynamic Action
# This script will be flattened in your target script once you export JSON
# (Refer to code_reuse_example.sh for another example)
#
# EXAMPLE
# ------------------------------------------------------------------------------
# Including this line to your script
#     #- restore_file.sh {"file_to_restore_path": "/rdsdbdata/config/my.cnf.template"}
# will copy the contents of /rdsdbdata/config/my.cnf.template.dynamicaction back
# into /rdsdbdata/config/my.cnf.template
#

fileToRestore=:file_to_restore_path
daCopy="$fileToRestore.dynamicaction"
  
# Check if the backup file exists
if [ ! -f "$daCopy" ]; then
  echo "Could not find a backup file named $daCopy"
  echo "Aborting."
  exit 1
else
  echo "Backup file found: $daCopy"
fi
 
echo "Restoring $fileToRestore from $daCopy ..."

# If the file given does not exist, create it.
if [ ! -f "$fileToRestore" ]; then
  echo "The file to restore $fileToRestore does not exist. Creating file ..."
  sudo touch $fileToRestore
  echo "Success"
fi

if cmp -s $daCopy $fileToRestore
then
  echo "$fileToRestore restore is already the same as its backup $daCopy. No need to restore."
else
  echo "Overwriting file"
  sudo cp $daCopy $fileToRestore
  if [ $? -eq 0 ]; then
    echo "Successfully copied $daCopy to $fileToRestore. Restoration complete."
  else
    echo "Something went wrong with copying $daCopy to $fileToRestore. Follow SOP manually."
    echo "Aborting."
    exit 1
  fi
fi

# Clean up backup file
sudo rm $daCopy

# <<<<<<<<<<<<<<<<<<<<<<<<<< End restore_file.sh <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
