function getJSON(url, data) {
    return new Promise(function(resolve, reject) {
        return $.ajax(url, {
            dataType: 'json',
            data: addAuthQueryString(data),
            success: resolve,
            error: reject
        });
    });
}

function postJSON(url, data, settings={}) {
    settings.contentType = "application/json";
    return post(url, data, settings);
}

/**
 * Attempts to POST the request and internally retries a set number of times on failure
 * Only retries if a server error is received. Client errors are aborted immediately.
 */
function post(url, data, settings) {
    function postWithRetries(url, data, settings, attempt, maxAttempts) {
        var ajaxRequest = function(url, data, settings) {
            return new Promise(function(resolve, reject) {
                const req = {
                    type: 'POST',
                    data: (typeof data === "object") ? JSON.stringify(data) : data,
                    success: resolve,
                    error: reject,
                    xhrFields: {
                        withCredentials: true
                    }
                };
                Object.assign(req, settings);
                return $.ajax(`${url}?_user=${window.user}&_api_token=${window.api_token}` +
                    `&_api_token_expiration=${window.api_token_expiration}`, req);
            });
        };
        let initialBackoff = 500;
        let maxBackoff = 4000;

        return ajaxRequest(url, data, settings)
            .catch(err => {
                console.log(err);
                //Abort retries if we've exceeded the max number of attempts, client timeout, or the client made a mistake
                if (attempt >= maxAttempts || (err.status >= 400 && err.status < 500) || err.status === 504) {
                    return err;
                }
                if (err.statusText === "timeout") {
                    throw "Request to Schnapps server timed out! If you made a large request it has/is being processed in the backend but was not able to set a response in time. " +
                    "Double check that it hasn't already been executed before making another request.";
                }
                return delay(getBackoffWithEqualJitter(maxBackoff, initialBackoff, attempt)).then(() => {
                    postWithRetries(url, data, settings, ++attempt, maxAttempts)
                })
            })
    }

    let maxAttempts = 3;
    let startingAttempt = 1;
    return postWithRetries(url, data, settings, startingAttempt, maxAttempts);
}

/**
 * Gets the next backoff amount given the maxBackoff and initial (or base) delay, and the attempt number.
 * Backoff is calculated using the Backoff with Equal Jitter algorithm from this article:
 * https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
 * @param maxBackoff The max amount possible for backoff
 * @param initialDelay An initial delay for the backoff to work from
 * @param attempt The attempt to compute the backoff for
 * @returns Number,
 */
function getBackoffWithEqualJitter(maxBackoff, initialDelay, attempt) {
    backoffNoJitter = Math.min(maxBackoff, (initialDelay * Math.pow(2, attempt)))
    backoffWithJitter = backoffNoJitter / 2 + (Math.random() * backoffNoJitter / 2);
    return backoffWithJitter;
}

/**
 * Promise which simply waits allowing retries to be chained to promises (and be returned as promises).
 * @param waitTime The amount to delay (ms)
 * @returns Promise which resolves after the passed delay (in ms)
 */
function delay(waitTime) {
    return new Promise(function(resolve) {
        setTimeout(resolve, waitTime);
    })
}


function execute_cluster_api_service(apiParameters) {
    var spinner = add_spinner($(".well").get(0));

    getJSON([window.api_endpoints[window.cluster_name], 'api', 'clusters', window.cluster_name, 'apis'].join('/'), {
        'parameters': apiParameters,
        'dry_run': 'false'
    }).then(function (data) {
        spinner.stop();
        var response = data['response'];
        bootbox.alert(_.unescape(objectToTable('Result' , response)));
    }).catch(function (jqxhr) {
        spinner.stop();
        alert_api_error(jqxhr);
    });
}


function copy_key(items, key, separator) {
    var csvs = [];
    _.forEach(items, function(item) {
        csvs.push(item[key]);
    });
    if (! copyTextToClipboard(csvs.join(separator))) {
        bootbox.prompt({
            title: "Copy to clipboard: Ctrl+A, Ctrl+C, Enter",
            value: csvs.join(separator),
            callback: function(result) {}
        });
    } else {
        toastr.info(key + ' values copied.');
    }
}


function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    var result;
    try {
        var successful = document.execCommand('copy');
        result = !! successful;
    } catch (err) {
        console.log(err);
        result = false;
    }
    document.body.removeChild(textArea);
    return result;
}


function addAuthQueryString(data) {
    if (data === undefined || data === null) {
        data = {};
    }
    data['_user'] = window.user;
    data['_api_token'] = window.api_token;
    data['_api_token_expiration'] = window.api_token_expiration;
    return data;
}


function alert_api_error(jqxhr) {
    let error_text;
    if (typeof jqxhr === "string" || jqxhr instanceof String) {
        error_text = jqxhr
    } else if (jqxhr.responseText != null) {
        //Angle brackets don't render anything inside them. Relevant if we wrapped and returned an exception
        error_text = jqxhr.responseText.replace(/[<>]/g,"")
    } else {
        error_text = "Unknown error."
    }

    var error_message = '<span class="label btn-danger">[ERROR]:</span> ';
    try {
        error_message += JSON.parse(error_text).message;
    } catch (e) {
        error_message += 'An error occurred: ' + error_text;
    }
    bootbox.alert(error_message);
}


function findClusterForId(id, success, failure) {
    var found = false;
    var left = _.size(window.api_endpoints);
    for (var cluster in window.api_endpoints) {
        getJSON(window.api_endpoints[cluster] + "/api/search/" + id).then(function(data) {
            if (found === false) {
                found = true;
                success(data['cluster']);
            }
        }).catch(function(jqxhr) {
            left = left - 1;
            if (left === 0 && failure !== null && failure !== undefined) {
                failure(jqxhr);
            }
        });
    }
}


function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * This cute mini spinner can be added relative to other elements
 */
function add_mini_spinner(target, options = {}) {
    let mini_spinner_options = {
        position: "relative",
        radius: 5,
        width: 2,
        length: 4
    }
    let opts = Object.assign(mini_spinner_options, options)
    return add_spinner(target, opts)
}

function add_spinner(target, options = {}) {
    let default_options = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    let opts = Object.assign(default_options, options)
    return new Spinner(opts).spin(target);
}


Handlebars.registerHelper('debug', function(v, options) {
    console.log(v);
});


Handlebars.registerHelper('eq', function(op1, op2, options) {
    return String(op1) == String(op2);
});


Handlebars.registerHelper('neq', function(op1, op2, options) {
    return String(op1) !== String(op2);
});


Handlebars.registerHelper('prettyObject', function(obj, options) {
    var out = "<pre>" + JSON.stringify(obj, undefined, 2).replace(/'/g, "&#39;") + "</pre>";
    return new Handlebars.SafeString(out);
});


Handlebars.registerHelper('prettyJSON', function(json_string, options) {
    if (json_string === "") {
        json_string = "{}";
    }
    var out = "<pre>" + JSON.stringify(JSON.parse(json_string), undefined, 2).replace(/'/g, "&#39;") + "</pre>";
    return new Handlebars.SafeString(out);
});


Handlebars.registerHelper('parseJSON', function(obj, options) {
    if (! (obj instanceof String || typeof obj === "string")) {
        return obj;
    }
    if (obj === "") {
        obj = "{}";
    }
    return JSON.parse(obj);
});


Handlebars.registerHelper('stringifyJSON', function(obj, options) {
    return JSON.stringify(obj);
});


Handlebars.registerHelper('timeStamp', function(timestamp, options) {
    if (timestamp === 0) {
        return "0";
    }
    return moment(timestamp).format("lll");
});


Handlebars.registerHelper('microTimeStamp', function(timestamp, options) {
    if (timestamp === 0) {
        return "0";
    }
    return moment(timestamp / 1000).format("lll");
});


Handlebars.registerHelper('nonEmpty', function(val) {
    return !_.isEmpty(val);
});


function capacity(bytes) {
    var sizes = ["bytes", "kB", "MB", "GB", "TB", "PB"];
    var i = 0;
    while (bytes > 1024) {
        i++;
        bytes /= 1024;
    }
    return Number(bytes).toFixed(3) + sizes[i];
}


Handlebars.registerHelper('capacity', function(bytes, options) {
    return capacity(bytes);
});


function capacityPopover(bytes) {
    var out = prompt("enter data");

    return new Handlebars.SafeString(out);
}


Handlebars.registerHelper('wrappableString', function(str, options) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
        out += str[i];
        if (i % 10 == 0) {
            out += '<wbr>';
        }
    }
    return new Handlebars.SafeString(out);
});


Handlebars.registerHelper('capacityPopover', capacityPopover);


Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


function action_links_popover(item, name, value) {
    var out = '';
    if (!! value) {
        out += '<a class="hover-popover-link" href="javascript:void(0);" ';
        out += 'data-html="true" ';
        out += 'data-content="';
        var out2 = '';
        var links = get_action_links_for_field(name, value, {
            item: item,
            rds_console_search_url: window.rds_console_search_url,
            ec2_admiral_search_url: window.ec2_admiral_search_url,
            cluster_name: window.cluster_name
        });
        var keys = _.keys(links).sort();
        // Sort the "Logs" links
        keys.sort((a, b) => a.includes('Logs') - b.includes('Logs'))
        _.forEach(keys, function (key) {
            var icon = '';
            switch (key) {
                case 'Schnapps':
                    icon = 'fa fa-search';
                    break;
                case 'RDS Console':
                    icon = 'fa fa-search';
                    break;
                case 'EC2 Admiral':
                    icon = 'fa fa-search';
                    break;
                case 'Service Owner Tools':
                    icon = 'fa fa-search';
                    break;
                case 'SSH':
                    icon = 'fa fa-terminal';
                    break;
                default:
                    icon = 'fa fa-table';
                    break;
            }

            out2 += '<a target="_blank" href="' + links[key] + '"><i class="' + icon + '"></i> ' + key + '</a><br>';
        });

        if (!! out2) {
            out2 = '<a class="copy-value-link" href="javascript:void(0);" data-value="' + value + '"><i class="fa fa-clipboard"></i> Copy</a><br>' + out2;
            out += Handlebars.Utils.escapeExpression(out2) + '" title="' + name + ': ' + value + '"><i class="fa fa-external-link-square"></i></a>';
            return out;
        }
    }
    return '';
}


Handlebars.registerHelper('actionLinksPopover', function(item, name, value) {
    return new Handlebars.SafeString(action_links_popover(JSON.parse(item), name, value));
});


function get_action_links_for_field(name, value, options) {
    const field = name.toLowerCase().replace(/-/g, '_').replace(/ /g, '_');
    if (! options.item) {
        options.item = {};
    }
    const links = {};
    if (!! value) {
        if (isSearchableField(field)) {
            links['Schnapps'] = `/search/#?_id=${value}`;
        }
        switch (true) {
            case /public_ip_address/.test(field):
                if (!! options.cluster_name) {
                    links['Environments'] = `/clusters/${options.cluster_name}/environments/#/?public_ip_address=${value}`;
                }
                break;
            case /instance_id/.test(field):
                if (!! options.cluster_name) {
                    links['SSH'] = `/clusters/${options.cluster_name}/shell/${value}/`;
                    links['Environments'] = `/clusters/${options.cluster_name}/environments/#/?instance_id=${value}`;
                    if (!! options.ec2_admiral_search_url) {
                        links['EC2 Admiral'] = options.ec2_admiral_search_url + value;
                    }
                    if (options.item.environment_type === 'HUB') {
                        links['Hubs'] = `/clusters/${options.cluster_name}/hubs/#/?instance_id=${value}`;
                    }
                    if (options.item.environment_type === 'INSTA_HUB') {
                        links['InstaHubs'] = `/clusters/${options.cluster_name}/insta_hubs/#/?instance_id=${value}`;
                    }
                    if (options.item.environment_type === 'REP') {
                        links['REPs'] = `/clusters/${options.cluster_name}/reps/#/?instance_id=${value}`;
                    }
                    if (options.item.environment_type === 'WORLD_MANAGER') {
                        links['Worlds'] = `/clusters/${options.cluster_name}/worlds/#/?lock_holder=${value}`;
                    }
                }
                break;
            case /lock_holder/.test(field):
                if (!! options.cluster_name) {
                    links['SSH'] = `/clusters/${options.cluster_name}/shell/${value}/`;
                    links['Environments'] = `/clusters/${options.cluster_name}/environments/#/?instance_id=${value}`;
                }
                break;
            case /ip_address/.test(field):
                if (!! options.cluster_name) {
                    links['SSH'] = `/clusters/${options.cluster_name}/shell/${value}/`;
                    links['Environments'] = `/clusters/${options.cluster_name}/environments/#/?ip_address=${value}`;
                }
                break;
            case /world_id/.test(field):
                if (!! options.cluster_name) {
                    links['Hubs'] = `/clusters/${options.cluster_name}/hubs/#/?world_id=${value}`;
                    links['Insta-Hubs'] = `/clusters/${options.cluster_name}/insta_hubs/#/?world_id=${value}`;
                    links['REPs'] = `/clusters/${options.cluster_name}/reps/#/?world_id=${value}`;
                    links['Worlds'] = `/clusters/${options.cluster_name}/worlds/#/?world_id=${value}`;
                    links['AuditLogs'] = `/clusters/${options.cluster_name}/audit_logs/${value}`;
                    links['ControlLogs'] = `/clusters/${options.cluster_name}/control_logs/${value}`;
                    links['PersistenceLogs'] = `/clusters/${options.cluster_name}/persistence_logs/${value}`;
                    links['ServerLogs'] = `/clusters/${options.cluster_name}/server_logs/${value}`;
                    links['ChatLogs'] = `/clusters/${options.cluster_name}/chat_logs/${value}`;
                    links['LogUploaderLogs'] = `/clusters/${options.cluster_name}/loguploader_logs/${value}`;
                    // Only show the Unknown Logs link if in the devo or gamma environment. Should not be accessible in prod.
                    if (options.cluster_name.includes('devo') || options.cluster_name.includes('gamma')) {
                        links['UnknownLogs'] = `/clusters/${options.cluster_name}/unknown_logs/${value}`;
                    }
                }
                break;
            case /world_name/.test(field):
                if (!! options.cluster_name) {
                    links['Hubs'] = `/clusters/${options.cluster_name}/hubs/#/?world_name=${value}`;
                    links['Insta-Hubs'] = `/clusters/${options.cluster_name}/insta_hubs/#/?world_name=${value}`;
                    links['REPs'] = `/clusters/${options.cluster_name}/reps/#/?world_name=${value}`;
                    links['Worlds'] = `/clusters/${options.cluster_name}/worlds/#/?world_name=${value}`;
                }
                break;
            default:
                break;
        }
    }
    return links;
}


Handlebars.registerHelper('jsonItemPopover', function(title, item) {
    var out = "<a class='hover-popover-link no-wrap' href='javascript:void(0);' data-placement='left' "
        + "data-html=true data-content='<div style=\"max-width: 600px; max-height: 600px; overflow: auto; padding: 2px;\">" + item + "</div>'"
        + "><i class='fa fa-eye'></i></a> "+ prettyName(title);
    return new Handlebars.SafeString(out);
});

Handlebars.registerHelper('dangerHighlightGT0', function(val) {
    if (parseInt(val) > 0) {
        return "danger";
    } else {
        return "";
    }
});


Handlebars.registerHelper('escapeSingleQuote', function(val) {
    return String(val).replace(/'/g, '&apos;');
});


function prettyName(name) {
    var words = name.split("_").join(" ");
    words = words.replace(/([a-z])([A-Z])/g, '$1 $2');
    words = capitalizeWords(words);
    return words;
}


Handlebars.registerHelper('prettyName', prettyName);


function prettyValue(value) {
    if (typeof value === typeof "1") {
        var start = 0;
        var end = 25;
        var out = value.slice(start, end);
        while (end <= value.length) {
            start = end;
            end += 25;
            out += '<wbr>' + value.slice(start, end);
        }
        return out;
    }

    return value;
}


function objectToTable(title, obj, tableCssClass = "json-table") {
    let out;
    if (title != null) {
        out = `<table class="${tableCssClass}"><thead><tr><th colspan="2">${prettyName(title)}</th></tr></thead><tbody>`;
    } else {
        out = `<table class="${tableCssClass}"><tbody>`;
    }
    // Show the object in sorted key order
    if (obj) {
        if(Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const item = obj[i];
                // If this is an array of arrays, then use the first element as the title if it's a string
                const title = Array.isArray(item) && item.length > 1 && (typeof item[0] === 'string' || item[0] instanceof String) ? item[0] : '';
                out += "<tr>" + objectToTable2(title, item) + "</tr>";
            }
        }
        else {
            for (const key of Object.keys(obj).sort()) {
                if (obj.hasOwnProperty(key)) {
                    var newKey = obj instanceof Array ? "" : key;
                    out += "<tr>" + objectToTable2(newKey, obj[key]) + "</tr>";
                }
            }
        }
    }
    out += "</tbody></table>";
    return out;
}


function objectToTable2(title, obj) {
    if (obj === undefined || obj === null) {
        return '<td style="text-align: left;">' + prettyName(title) + ': </td><td></td>';
    }
    var isJsonString = false;
    if (typeof obj === typeof '1') {
        try {
            obj = JSON.parse(obj);
            obj = JSON.stringify(obj, null, 4);
            isJsonString = true;
        } catch(err) {

        }
    }
    if (typeof obj === typeof 1 || typeof obj === typeof '1' || typeof obj === typeof true) {
        if (title === '') {
            return '<td colspan="2">' + prettyValue(obj) + '</td>'
        }
        var objHtml = isJsonString ? '<td><pre>' + obj + '</pre></td>'
            : '<td style="text-align: right;">'
            + Handlebars.Utils.escapeExpression(action_links_popover(undefined, title, obj))
            + ' ' + prettyValue(obj) + '</td>';
        return '<td style="text-align: left;">' + prettyName(title) + ': </td>' + objHtml;
    }
    var out = '<td colspan="2"><table class="json-table-inner"><thead><tr><th colspan="2"><a class="json-table-expand" href="javascript:void(0)"><i class="fa fa-plus-square"></i></a><a style="display:none" class="json-table-collapse" href="javascript:void(0)"><i class="fa fa-minus-square"></i></a> ' + prettyName(title) + '</th></tr></thead><tbody style="display:none">';
    out = title === '' ? '<td colspan="2"><table class="json-table-inner"><tbody>' : out;
    // Show the object in sorted key order
    for (const key of Object.keys(obj).sort()) {
        if (obj.hasOwnProperty(key)) {
            var newKey = obj instanceof Array ? '' : key;
            out += '<tr>' + objectToTable2(newKey, obj[key]) + '</tr>';
        }
    }
    out += '</tbody></table></td>';
    return out;
}


Handlebars.registerHelper('objectToTable', function(title, obj) {
    var out = objectToTable(title, obj);
    return new Handlebars.SafeString(out.replace(/'/g, '&#39;'));
});


$.fn.serializeAllArray = function (css_class) {
    var arr = [];

    $('input,select',this).each(function () {
        var css_condition = css_class && $(this).hasClass(css_class);
        if (this.name) {
            arr.push({name: this.name, value: $(this).val()});
        }
    });
    return arr;
}

$.fn.serializeObject = function(include_disabled, css_class)
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


Handlebars.registerHelper('timeNow', function() {
    return new Handlebars.SafeString(moment().utc().format("YYYY-MM-DDTHH:mm:ss") + "Z");
})

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i <= n; ++i)
        accum += block.fn(i);
    return accum;
});


Handlebars.registerHelper('splitBy', function(n, list) {
    var lists = _.groupBy(list, function(element, index){
        return index % Math.ceil(_.size(list) / n);
    });
    return _.toArray(lists);
});

Handlebars.registerHelper('paginationControls', function(pages, options) {
    var accum = '';
    var page = options.hash.page;
    var range = options.hash.range;
    var resource_name = options.hash.resource_name;
    var llimit = Math.max(1, page - range + 1);
    var ulimit = Math.min(pages, page + range - 1);
    if (llimit !== 1) {
        accum += "<li class='active'><a>&hellip;</a></li>"
    }
    if (resource_name !== null && resource_name !== undefined) {
        for(var i = llimit; i <= ulimit; ++i) {
            accum += "<li class='" + (i === page ? 'active' : '') + " '>" +
                "<a class='page-link' href='javascript:void(0);'" +
                "data-page='" + i + "' data-resource='" + resource_name + "'>" + i + "</a></li>";
        }
    } else {
        for(var i = llimit; i <= ulimit; ++i) {
            accum += "<li class='" + (i === page ? 'active' : '') + " '>" +
                "<a class='page-link' href='javascript:void(0);'" +
                "data-page='" + i + "'>" + i + "</a></li>";
        }
    }

    if (ulimit !== pages) {
        accum += "<li class='active'><a>&hellip;</a></li>"
    }
    return new Handlebars.SafeString(accum);
});

Handlebars.registerHelper('clusterName', function() {
    return $(".cluster-title").data('name');
});

Handlebars.registerHelper('rdsConsoleSearchUrl', function() {
    return window.rds_console_search_url;
});

Handlebars.registerHelper('displayFieldElement', function(field, obj) {
    var ps = Handlebars.partials;
    var name = field + "__field_element";
    if (!ps[name])
        return "";
    if(typeof ps[name] !== 'function')
        ps[name] = Handlebars.compile(ps[name]);
    return new Handlebars.SafeString(ps[name](obj));

});

Handlebars.registerHelper('preProcessField', function(val, options) {
    var s = options.fn(options.hash['obj']);
    var field = options.hash['field'];
    if (window.editable_field_metadata !== undefined) {
        var is_editable_field = window.editable_field_metadata[field];
        var obj = options.hash['obj'];
        if (is_editable_field && valid_transition_states(obj, field, window.user).length > 0) {
            s = $(s).html(
                "<span data-field='" + field + "' class='db-value-layout'>" + $(s).html() +
                "<a class='edit-field-link' href='javascript:void(0);'>edit</a></span><span class='edit-layout'></span>")[0].outerHTML;
        }
    }
    return s;
});

function parse_timestamp_val(param, val) {
    var result = val;
    if ((/__from/.test(param)) || (/__to/.test(param))) {
        if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}/.test(result)) {
            result = moment(result, "MM/DD/YYYY HH:mm").format("x");
            if (/__micros/.test(param)) {
                result += "000";
            }
        }
    }
    return result;
}

function parse_timestamp_param(param) {
    var result = param;
    if ((/__from/.test(result)) || (/__to/.test(result))) {
        result = result.replace('__from','').replace('__to','').replace('__micros','');
    }
    return result;
}

function isSearchableField(field) {
    var SEARCHABLE_COLUMN_FLAGS = ['_id', 'ip_address', 'lock_holder', 'world_name'];
    for (var index in SEARCHABLE_COLUMN_FLAGS) {
        var re = new RegExp(SEARCHABLE_COLUMN_FLAGS[index]);
        if (re.test(field)) {
            return true;
        }
    }
    return false;
}

// Create a text with pop-over value
function withPopOver(linkText, popOver, options) {
    options = (options === undefined) ? {} : options;
    var args = _.defaults(options, {"max-width": 800, "color": ''});
    console.log("args: " + JSON.stringify(args));
    args.color = (_.isEmpty(args.color)) ? '' : "style='color:" + args.color + "' ";
    var popOverText = Handlebars.helpers.prettyObject(popOver);
    return new Handlebars.SafeString("<a class='popover-link' href='javascript:void(0);' " +
        args.color +
        "data-placement='left' data-html=true " +
        "data-content='<div style=\"max-width: " + args.width + "px\"> " +
        popOverText + "</div>'>" + linkText + "</a>");
}

// Test a link to see whether it's a valid MCM link
function isValidMcm(mcmLink, allowEmpty=false) {
    if (allowEmpty && mcmLink === '') {
        return true;
    }
    return (/^(https:\/\/)?mcm\.amazon\.com\/cms\/MCM-\d+/i).test(mcmLink);
}