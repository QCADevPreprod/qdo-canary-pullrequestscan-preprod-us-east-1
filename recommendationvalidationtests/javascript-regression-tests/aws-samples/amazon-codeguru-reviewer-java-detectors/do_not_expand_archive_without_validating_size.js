// {fact rule=do_not_expand_archive_files_without_validating_js_rule@v1.0 defects=1}

function unvalidated_archive_files_non_compliant()
{   
    const tar = require('tar');
    const express = require('express');
    const app = express();

    app.post('/upload-zip',  (req, res) => {
        let tarFileName = req.files.tarFileName;
        // Noncompliant: File extracted without controlling size of extracted data.
        tar.x({                         
            file: tarFileName
        });
      })
}
// {/fact}

// {fact rule=do_not_expand_archive_files_without_validating_js_rule@v1.0 defects=0}

function unvalidated_archive_files_compliant()
{
    const tar = require('tar');
    const express = require('express');
    const app = express();
    const MAX_FILES = 10000;
    const MAX_SIZE = 1000000000; // 1 GB

    app.post('/upload-zip',  (req, res) => {
        let fileCount = 0;
        let totalSize = 0;
        let tarFileName = req.files.tarFileName;
        // Compliant: File extracted with defining limit on extracted data.
        tar.x({
            file: tarFileName,
            filter: (path, entry) => {
                fileCount++;
                if (fileCount > MAX_FILES) {
                    throw 'Reached max. number of files';
                }

                totalSize += entry.size;
                if (totalSize > MAX_SIZE) {
                    throw 'Reached max. size';
                }

                return true;
            }
        });
    })
}
// {/fact}

