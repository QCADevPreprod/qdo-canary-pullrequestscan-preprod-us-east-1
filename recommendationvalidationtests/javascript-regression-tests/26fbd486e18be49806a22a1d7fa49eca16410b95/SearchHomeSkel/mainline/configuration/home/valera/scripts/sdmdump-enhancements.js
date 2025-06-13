// ==UserScript==
// @name     SdmDump enhancements
// @include  http://stack-tools.*.search.amazon.com/sdm.cgi*
// @include  https://a9-tools.search.amazon.com/sdm/swa.cgi*
// @include  https://a9-search-tools-website-prod.corp.amazon.com/sdm/swa.cgi?*obj=A9SdmDump*
// @downloadURL    https://drive.corp.amazon.com/view/valera@/sdmdump-enhancements.user.js?download=true&gm_native=1
// @version  1.76
// @grant    none
// ==/UserScript==

var version_rx = new RegExp(/(\[min_attr_ver\]=|:)(\d{13})([\]]|$)/, "gm");
var text_split_rx = new RegExp(/^.*([\n\r]+|$)/, "gm");
var fake_proffer_rx = new RegExp(/x1-.*/, "g");
var specials_rx = new RegExp(/\"(start|end)\":(\d{10})/, "g");
var latest_color = "a23efa";

function to_long_timestamp(seconds) {
    let d = new Date(0);
    d.setUTCSeconds(seconds);
    return d;
}

function pad2(num) {
    let s = "0" + num;
    return s.substr(s.length - 2);
}

function is_epoch_time(s) {
    // Consider value as epoch time if it's a string of 9 or 10 digits only.
    return /^([0-9]){9,10}$/.test(s);
}

function to_short_timestamp(seconds) {
    let d = new Date(0);
    d.setUTCSeconds(seconds);
    return (pad2(d.getMonth() + 1)) + "/" +
        pad2(d.getDate())       + "/" +
        pad2(d.getFullYear())   + " " +
        pad2(d.getHours())      + ":" +
        pad2(d.getMinutes())    + ":" +
        pad2(d.getSeconds());
}

Date.prototype.today = function () {
    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "/" + ((this.getDate() < 10)?"0":"") + this.getDate() + "/" + this.getFullYear();
}

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function build_dp_link(asin, mid) {
    let mid_to_domain = {
        '1'      : 'com',
        '3'      : 'co.uk',
        '4'      : 'de',
        '5'      : 'fr',
        '44551'  : 'es',
        '623225021' : 'eg',
        '44571'  : 'in',
        '35691'  : 'it',
        '6'      : 'co.jp',
        '7'      : 'ca',
        '3240'   : 'cn',
        '526970' : 'com.br',
        '771770' : 'com.mx',
        '111172' : 'com.au',
        '111162' : 'ru',
        '328451' : 'nl',
        '338801' : 'ae',
        '338811' : 'sa',
        '338851' : 'com.tr'
    };

    if(mid in mid_to_domain) {
        return `http://amazon.${mid_to_domain[mid]}/dp/${asin}`;
    } else {
        return null;
    }
}

function build_sable_explorer_links(stack, mid, asin) {
    var stack_to_url = {
        'na-prod': 'https://sable-data-explorer-iad.iad.proxy.amazon.com/',
        'fe-prod': 'https://sable-data-explorer-pdx.pdx.proxy.amazon.com/',
        'cn-prod': 'https://sable-data-explorer-pek-pdx.pdx.proxy.amazon.com/',
        'eu-prod': 'https://sable-data-explorer-dub.dub.proxy.amazon.com/',
        'na-devdata': 'https://sable-explorer-test.corp.amazon.com/'
    };
    if(stack in stack_to_url) {
        var m_asin = mid + '_' + asin;
        var sable_scope = [{'url':`${stack_to_url[stack]}?usecase=getkeyprefix&scope=%2FBuy%2FBuy%2Fbackend&keyprefix=${m_asin}&count=10`, 'scope':'/Buy/Buy/Backend','text':'Offer Service Buyability data'},
            {'url':`${stack_to_url[stack]}?usecase=getkey&scope=%2Fcatalog%2Fitem%2Fv1%2Fbackend&key=${m_asin}`,'scope':'/Catalog/Item/V1/Backend','text':'Catalog Attribute data'},
            {'url':`${stack_to_url[stack]}?usecase=getkeyprefix&scope=%2Fsda%2Fsearch_source%2Fitem&keyprefix=${m_asin}&count=10`, 'scope':'/SDA/Search_Source/Item','text':'SDA Self-Service data'}];
        var sable_explorer_links = [];

        sable_scope.forEach(element => sable_explorer_links.push(element));
        return sable_explorer_links;
    } else {
        return null;
    }
}

var latest = 0;

function version_with_decoded_timestamp(milliseconds) {
    return milliseconds + " <font color=\"#99BB99\">" + to_short_timestamp(milliseconds/1000) + "</font>";
}

function replacer(match, pre, milliseconds, post, offset, string) {
    latest = Math.max(latest, milliseconds);
    return pre + version_with_decoded_timestamp(milliseconds) + post;
}

function specials_replacer(match, attrname, seconds, offset, string) {
    return "\"" + attrname + "\":" + seconds + "<font color=\"#fe733b\">(" + to_short_timestamp(seconds) + ")</font>";
}

function highlight_latest_updates(text, latest) {
    let latest_rx = new RegExp(":" + latest + " ", "gm");
    text = text.replace(latest_rx, ":<font color=\"#" + latest_color + "\"><b>" + latest + "</b></font> ");
    return text;
}


function parse_params() {
    if(location.search.length > 1) {
        let key_values = location.search.substring(1).split('&');
        let key_values_filtered = key_values.filter(function(s) { return !s.startsWith('sort-proffers-by') });
        let sort_by_key_value = key_values.filter(function(s) { return s.startsWith('sort-proffers-by') });
        let params = key_values_filtered.join('&');
        let sort_by = '';
        let reverse = false;
        if(sort_by_key_value.length > 0) {
            sort_by = sort_by_key_value[0].split('=')[1];
            if(sort_by.startsWith('-')) {
                reverse = true;
                sort_by = sort_by.substring(1);
            }
        }
        return [params, sort_by, reverse];
    } else {
        return ['', '', false];
    }
}

function get_stack() {
    return location.hostname.split('\.')[1];
}

var params_and_sort_by = parse_params();
var params = params_and_sort_by[0];
var sort_by = params_and_sort_by[1];
var reverse = params_and_sort_by[2];

var name_s = 'name';
var earliest_s = 'proffer-created';
var latest_s = 'most-recent-update';


function decode_holidays(s, indent) {
    let header = Array.from(Array(31)).map((e,i)=>(i+1).toString().padEnd(2, ' ')).join(' ');
    let sep = new Array(header.length+1).join('-');
    let decoded = atob(s).split('').map(function(c) { return c.charCodeAt(0).toString(2).padStart(8, '0'); }).join('').padStart(368, '0').split('').reverse();
    let month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cur = 0;
    var indent_s = new Array(indent+1).join(' ');
    let res = '';
    var by_month = new Array(12);
    for(let i=0; i<12; i++) {
        let m = (i + 2) % 12;
        function daysInMonth(month) { return new Date(2020, month+1, 0).getDate(); }
        let m_length = daysInMonth(m);
        //res += indent_s + month_name[m] + '  ' + decoded.slice(cur, cur + m_length).join('  ') + (i == 11 ? '' : '\n');
        by_month[m] = indent_s + month_name[m] + '  ' + decoded.slice(cur, cur + m_length).join('  ');
        cur += m_length;
    }
    res = by_month.join('\n');
    return indent_s + '     ' + header + '\n' +
        indent_s + '     ' + sep + '\n' +
        res.replace(/1/g, '<font color=red><b>x</b></font>').replace(/0/g, '.');
}

function replace_holidays(s, prefix, val, offset, string) {
    return prefix + val + '<br><font color=gray>' + decode_holidays(val, 8) + '</font>';
}

function decode_mfn_hours(s, k, v, offset, string) {
    let decoded = atob(v).split('').map(function(c) {
        return c.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('').padStart(7*24, '0');
    decoded = decoded.replace(/(.{8})(?!$)/g, '$1 ').replace(/(.{8} .{8} .{8}) /g, '$1<br>&nbsp; &nbsp; &nbsp;');
    return s + '<br>&nbsp; &nbsp; &nbsp;<font color=blue>' + decoded + '</font><br>'
}

function get_val(proffer_table, proffer, attr) {
    if(attr == proffer_table.attrNames.earliest_s ||
        attr == proffer_table.attrNames.latest_s) {
        return to_short_timestamp(proffer[attr][0]/1000);
    } else {
        let val = (proffer[attr] || []).join(', ');
        // Add additional decoding to the cell value
        val = val.replace(/"(delivery.hours|shipping.hours)":"([^"]*)"/g, decode_mfn_hours);
        return val;
    }
}

function is_proffer_shown(proffer_table, nproffer) {
    let name = proffer_table.proffer_names_sorted[nproffer];
    return proffer_table.proffers[name].visibility != 'collapse';
}

function is_all_values_same(proffer_table, attr) {
    let first = true;
    let last_val = null;
    for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
        let name = proffer_table.proffer_names_sorted[nproffer];
        if(proffer_table.proffers[name].visibility != 'collapse') {
            let val = proffer_table.get_val(proffer_table, proffer_table.proffers[name], attr);
            if(first) {
                first = false;
                last_val = val;
            } else {
                if(val != last_val) {
                    return false;
                }
            }
        }
    }
    return true;
}

function dalert(proffer_table, s) {
    if(proffer_table.dbg) {
        alert(s);
    }
}

function mark_similar_tds(proffer_table, attr, should_be_marked) {
    if(should_be_marked) {
        let last_val = null;
        for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
            if(proffer_table.is_proffer_shown(proffer_table, nproffer)) {
                let id = nproffer.toString() + attr;
                let td = document.getElementById(id);
                let name = proffer_table.proffer_names_sorted[nproffer];
                let val = proffer_table.get_val(proffer_table, proffer_table.proffers[name], attr);
                if(!last_val || last_val != val) {
                    td.style.borderLeft = '5px solid green';
                } else {
                    td.style.borderLeft = '1px solid #aaaaaa';
                }
                td.style.borderRight = '1px solid #aaaaaa';
                last_val = val;
            }
        }
        for(let nproffer = proffer_table.proffer_names_sorted.length-1; nproffer >= 0; nproffer--) {
            if(proffer_table.is_proffer_shown(proffer_table, nproffer)) {
                let id = nproffer.toString() + attr;
                let td = document.getElementById(id);
                td.style.borderRight = '5px solid green';
                break;
            }
        }
    } else {
        for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
            let id = nproffer.toString() + attr;
            let td = document.getElementById(id);
            td.style.borderLeft = '1px solid #aaaaaa';
            td.style.borderRight = '1px solid #aaaaaa';
        }
    }
}

function build_proffer_table(proffer_table) {
    function is_sorting_by(attr) { return attr == proffer_table.sortBy; }

    function get_val_and_nvalues(proffer, attr) {
        return [proffer_table.get_val(proffer_table, proffer, attr), (proffer[attr] || []).length];
    }

    function get_nproffers_s(shown) {
        if(proffer_table.proffer_names_sorted.length == shown) {
            return proffer_table.proffer_names_sorted.length + ' proffers';
        } else {
            return proffer_table.proffer_names_sorted.length + ' proffers (' + shown + ' shown)';
        }
    }

    function get_row_caption(attr, shown) {
        return (attr == proffer_table.attrNames.name_s) ? '<span id="nproffers">' +
            get_nproffers_s(shown) +
            '</span>':
            (attr == proffer_table.attrNames.earliest_s) ? 'proffer created' :
                (attr == proffer_table.attrNames.latest_s) ? 'most recent update' : attr;
    }

    var last_val;
    function build_td(proffer, attr, nproffer, all_values_same, td_width) {
        let val_and_nvalues = get_val_and_nvalues(proffer, attr);
        let val = is_proffer_shown(proffer_table, nproffer) ? val_and_nvalues[0] : '';
        let nvalues = val_and_nvalues[1];
        let tooltip = (nvalues > 1) ? 'title="' + nvalues + ' values"' : '';
        let td_color = proffer_table.get_td_color(attr, all_values_same, is_sorting_by(attr));
        let style = 'background-color:#' + td_color + ';border:1px solid #aaaaaa;';
        return '<td id="' + nproffer.toString() + attr + '" width="' + td_width + '%" style="' + style + '" ' + tooltip + '>' + val + '</td>';
    }

    function build_proffer_table_contents(proffers, proffer_attributes, sort_by, reverse) {
        proffer_table.proffer_names_sorted = Object.keys(proffers);
        if(sort_by) {
            function cmp(a, b) {
                let v1 = proffer_table.get_val(proffer_table, proffers[b],sort_by);
                let v2 = proffer_table.get_val(proffer_table, proffers[a],sort_by);
                return v1.localeCompare(v2);
            };
            proffer_table.proffer_names_sorted.sort(function(a, b) { return reverse ? cmp(a, b) : cmp(b, a); })
        } else {
            proffer_table.proffer_names_sorted.sort();
        }
        let td_width = Math.max(1, Math.floor(100 / (proffer_table.proffer_names_sorted.length + 1)));
        let proffer_table_contents = '';
        proffer_table_contents += '<col class="attributes"/>';
        let shown = 0;
        for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
            let style = '';
            if(proffer_table.proffers[proffer_table.proffer_names_sorted[nproffer]].visibility == 'collapse') {
                style = ' style="visibility:collapse;"';
            } else {
                shown += 1;
            }
            proffer_table_contents += '<col class="' + proffer_table.proffer_names_sorted[nproffer] + '"' + style + '/>';
        }
        proffer_table_contents += '<tr><td style="border: none;border-spacing: 0;border-collapse: collapse;">' +
            '<a href="#" id="unhide" ' +
            'style="visibility:' + (shown < proffer_table.proffer_names_sorted.length ? 'visible' : 'hidden') + ';" ' +
            'onclick="(function() {' +
            'let tbl = document.getElementById(\'proffer_table\');' +
            'tbl.unhide_all_proffers();' +
            'return false;' +
            '})(); return false;"><font size="-2">Show all hidden proffers</font></a></td>';
        for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
            proffer_table_contents += '<td style="border: none;border-spacing: 0;border-collapse: collapse; text-align:center;">' +
                '<a href="#" style="text-decoration:none;" id="close-' + proffer_table.proffer_names_sorted[nproffer] + '" ' +
                'onclick="(function() {' +
                'let tbl = document.getElementById(\'proffer_table\');' +
                'tbl.hide_proffer(' + nproffer + ');' +
                'return false;' +
                '})(); return false;"><font size="-2"><b>x</b></font></a></td>';
        }
        proffer_table_contents += '</tr>';

        for(let nattr = 0; nattr < proffer_table.attributesSorted.length; nattr++) {
            let attr = proffer_table.attributesSorted[nattr];
            let all_values_same = proffer_table.is_all_values_same(proffer_table, attr);
            let td_color = proffer_table.get_td_color(attr, all_values_same, is_sorting_by(attr));
            proffer_table_contents += '<tr><td id="attr-' + attr + '" width="1%" style="background-color:#' + td_color + ';border:1px solid #aaaaaa;">' +
                get_row_caption(attr, shown);
            let arrow_visibility = all_values_same ? 'hidden' : 'visible';
            let arrow_char = is_sorting_by(attr) ? (reverse ? '&#x25C0;': '&#x25B6;') : '&#x25B7;';
            let arrow = '<font color="green"><div id="arrow-' + attr + '" style="float:right; visibility:' + arrow_visibility + ';">' + arrow_char + '</div></font>';
            proffer_table_contents +=
                ' <a href="#" onclick="(function(){' +
                'let pt = document.getElementById(\'proffer_table\');' +
                'pt.sortReverse = (pt.sortBy == \'' + attr + '\') && (pt.sortReverse == false);' +
                'pt.sortBy = \'' + attr + '\';' +
                'pt.build_proffer_table(pt);' +
                'return false;' +
                '})(); return false;" style="text-decoration:none;">' + arrow + '</a></td>';
            for(let nproffer = 0; nproffer < proffer_table.proffer_names_sorted.length; nproffer++) {
                let name = proffer_table.proffer_names_sorted[nproffer];
                proffer_table_contents += build_td(proffers[name], attr, nproffer, all_values_same, td_width);
            }
            proffer_table_contents += '</tr>\n';
        }
        return proffer_table_contents;
    }

    proffer_table.innerHTML = build_proffer_table_contents(proffer_table.proffers,
        proffer_table.profferAttributes,
        proffer_table.sortBy,
        proffer_table.sortReverse);

    if(document.getElementById('attr-' + proffer_table.attributesSorted[0])) {
        for(let nattr = 0; nattr < proffer_table.attributesSorted.length; nattr++) {
            let attr = proffer_table.attributesSorted[nattr];
            let all_values_same = proffer_table.is_all_values_same(proffer_table, attr);
            let should_be_marked = !all_values_same && is_sorting_by(attr) && attr != proffer_table.attrNames.name_s;
            proffer_table.mark_similar_tds(proffer_table, attr, should_be_marked);
        }
    }
}

function unhide_all_proffers() {
    function is_sorting_by(attr) { return attr == proffer_table.sortBy; }

    let proffer_table = document.getElementById('proffer_table');
    let proffer_count = Object.keys(proffer_table.proffers).length;
    let unhide = document.getElementById('unhide');
    for(let nproffer = 0; nproffer < proffer_count; nproffer++) {
        proffer_table.getElementsByTagName('col')[nproffer + 1].style.visibility = '';
        proffer_table.proffers[proffer_table.proffer_names_sorted[nproffer]].visibility = '';
    }
    unhide.style.visibility = 'hidden';
    document.getElementById('nproffers').innerHTML = proffer_count + ' proffers';

    for(let nattr = 0; nattr < proffer_table.attributesSorted.length; nattr++) {
        let attr = proffer_table.attributesSorted[nattr];
        let all_values_same = proffer_table.is_all_values_same(proffer_table, attr);
        let td_color = proffer_table.get_td_color(attr, all_values_same, is_sorting_by(attr));
        document.getElementById('attr-' + attr).style.backgroundColor = '#' + td_color;
        let arrow = document.getElementById('arrow-' + attr);
        if(arrow) {
            arrow.style.visibility = all_values_same ? 'hidden' : 'visible';
        }
        for(let nproffer = 0; nproffer < proffer_count; nproffer++) {
            let name = proffer_table.proffer_names_sorted[nproffer];
            let proffer = proffer_table.proffers[name];
            let val = proffer_table.get_val(proffer_table, proffer, attr);

            let td = document.getElementById(nproffer.toString() + attr);
            td.innerHTML = val;
            td.style.backgroundColor = '#' + td_color;
        }
        let should_be_marked = !all_values_same && is_sorting_by(attr) && attr != proffer_table.attrNames.name_s;
        proffer_table.mark_similar_tds(proffer_table, attr, should_be_marked);
    }

    return false;
}

function hide_proffer(nproffer) {
    var proffer_table = document.getElementById('proffer_table');

    function is_sorting_by(attr) { return attr == proffer_table.sortBy; }

    function get_nproffers_s(proffer_count, shown) {
        let ret = proffer_count + ' proffers';
        if(proffer_count != shown) {
            ret += ' (' + shown + ' shown)';
        }
        return ret;
    }

    for(let nattr = 0; nattr < proffer_table.attributesSorted.length; nattr++) {
        let attr = proffer_table.attributesSorted[nattr];
        let td = document.getElementById(nproffer.toString() + attr);
        if(td) {
            td.innerHTML = "";
        }
    }

    proffer_table.getElementsByTagName('col')[nproffer + 1].style.visibility = 'collapse';
    proffer_table.proffers[proffer_table.proffer_names_sorted[nproffer]].visibility = 'collapse';
    document.getElementById('unhide').style.visibility = 'visible';
    let proffer_count = Object.keys(proffer_table.proffers).length;
    let shown = 0;
    for(let nproffer = 0; nproffer < proffer_count; nproffer++) {
        if(proffer_table.is_proffer_shown(proffer_table, nproffer)) {
            shown += 1;
        }
    }

    for(let nattr = 0; nattr < proffer_table.attributesSorted.length; nattr++) {
        let attr = proffer_table.attributesSorted[nattr];
        let all_values_same = proffer_table.is_all_values_same(proffer_table, attr);
        let td_color = proffer_table.get_td_color(attr, all_values_same, is_sorting_by(attr));
        document.getElementById('attr-' + attr).style.backgroundColor = '#' + td_color;
        if(all_values_same) {
            let arrow = document.getElementById('arrow-' + attr);
            if(arrow) {
                arrow.style.visibility = 'hidden';
            }
        }
        for(let nproffer = 0; nproffer < proffer_count; nproffer++) {
            let id = nproffer.toString() + attr;
            document.getElementById(id).style.backgroundColor = '#' + td_color;
        }
        let should_be_marked = !all_values_same && is_sorting_by(attr) && attr != proffer_table.attrNames.name_s;
        proffer_table.mark_similar_tds(proffer_table, attr, should_be_marked);
    }

    document.getElementById('nproffers').innerHTML = get_nproffers_s(proffer_count, shown);

    return false;
}

function get_doc_is_important(availability_general,
                              availability_from_json,
                              availability_from_tuple,
                              availability_from_full_proffers,
                              launch_date,
                              tier_engagement) {
    let doc_is_available = (availability_general < 2) ||
        (availability_from_json < 2) ||
        (availability_from_tuple < 2) ||
        (availability_from_full_proffers < 2);

    let engagement_is_high = tier_engagement >= 5000000;

    let now = (new Date).getTime() / 1000;
    let time_since_launch_date = now - launch_date;
    let time_since_launch_date_threshold = 45 * 24 * 3600   // 45 days
    let doc_is_recent = time_since_launch_date < time_since_launch_date_threshold;

    let doc_is_important = doc_is_available || engagement_is_high || doc_is_recent;

    return [doc_is_important, doc_is_available, engagement_is_high, doc_is_recent];
}


let dp_link = null;
var sable_explorer_links = null;
var proffers = {};
let proffer_attributes = new Set();

function get_the_right_pre() {
    let pres = document.getElementsByTagName('pre');
    for(let i = 0; i < pres.length; i++) {
        if(pres[i].previousSibling.previousSibling.innerHTML == 'Results from Doc Dump') {
            return pres[i];
        }
    }
    return null;
}

let pre = get_the_right_pre();
if(pre) {
    let next_sibling = pre.nextSibling;
    let text = "";
    let last_proffer_name = null;
    let lines = pre.innerHTML.match(text_split_rx);
    let real_proffers = 0;
    let fake_proffers = 0;
    let asin = null;
    let availability_general = 2;
    let availability_from_json = 2;
    let availability_from_tuple = 2;
    let availability_from_full_proffers = 2;
    let launch_date = (new Date).getTime() / 1000;
    let tier_engagement = 0;
    let proffers_id_tag = '<hr id="proffers">';
    let versions = {};
    for(let n = 0; n < lines.length; n++) {
        let m1 = lines[n].match("^([^\[]+)\\[.*?:(\\d{13}).*?\\]=(.+)");
        if(m1) {
            let full_attr_name = m1[1];
            let version = m1[2];
            let value = m1[3];
            let m2 = full_attr_name.match("^proffer/([^/]+)/([^\[]+)");
            let attr = full_attr_name;

            if(m2) {         // proffer attribute
                let name = m2[1];
                attr = m2[2];
                if(!last_proffer_name) {
                    text += proffers_id_tag + '<hr>';
                }
                if(last_proffer_name != name) {
                    if(last_proffer_name) {
                        text += '<hr>';
                    }
                    if(name.match(fake_proffer_rx)) {
                        fake_proffers += 1;
                    } else {
                        real_proffers += 1;
                    }
                }

                proffer_attributes.add(attr);
                if(!(name in proffers)) {
                    proffers[name] = {[name_s] : [name], [earliest_s] : [version], [latest_s] : [version]};
                }
                proffers[name][earliest_s][0] = Math.min(version, proffers[name][earliest_s][0]);
                proffers[name][latest_s][0] = Math.max(version, proffers[name][latest_s][0]);
                // insert invisible spaces for optional word wrap:
                value = value.replace(/,/g, ',&#8203;');
                if(attr == 'holidays') {
                    value = value.replace(/(.{8})/g, '$1&#8203;');
                }
                if(!(attr in proffers[name])) {
                    proffers[name][attr] = new Array(value);
                } else {
                    proffers[name][attr].push(value);
                }
                if(attr == 'availability') {
                    availability_from_full_proffers = Math.min(availability_from_full_proffers, parseInt(value))
                }
                last_proffer_name = name;
            } else {        // regular attribute

                if(attr == 'holidays') {
                    lines[n] = lines[n].replace(/^(holidays\[summary:\d{13}\]=)(.+)/, replace_holidays);
                }

                if(!asin && attr == 'asin') {
                    asin = value;
                }

                if(attr.includes('date') && is_epoch_time(value)) {
                    // Attempts to interpret attributes with "date" in the name (e.g. date_first_available,
                    // launch-date) as epoch time and show the decoded value
                    let ts = to_short_timestamp(value);
                    lines[n] = lines[n].replace(value, `${value} <font color="#fe733b">(${ts})</font>`);
                }

                if(!dp_link && asin) {
                    if(attr == 'marketplace-id') {
                        dp_link = build_dp_link(asin, value);
                        sable_explorer_links = build_sable_explorer_links(get_stack(), value, asin);
                    }
                }

                if(attr == 'specials') {
                    lines[n] = lines[n].replace(specials_rx, specials_replacer);
                }

                if (last_proffer_name) {
                    text += '<hr>';
                    last_proffer_name = null;
                }

                if (attr.endsWith('_proffers')) {
                    availability_from_json = Math.min(availability_from_json, parseInt(JSON.parse(value).availability || '2'));
                } else if( attr.endsWith('_offers')) {
                    availability_from_tuple = Math.min(availability_from_tuple, parseInt(value.split(':')[1] || '2'));
                } else if(attr == 'availability') {
                    availability_general = Math.min(availability_general, parseInt(value));
                }

                if(attr == 'launch-date') {
                    launch_date = parseInt(value) || launch_date;
                }

                if(attr == 'engagement-probability-v2') {
                    tier_engagement = parseInt(value) || 0;
                }
            }

            lines[n] = lines[n].replace(version_rx, replacer);

            if(!(version in versions)) {
                versions[version] = new Set();
            }
            versions[version].add(full_attr_name);
        }
        text += lines[n];
    }
    text = highlight_latest_updates(text, latest);

    let nproffers = real_proffers + fake_proffers;
    let nproffers_s = '<font color="red"><a href="#proffers" style="color:#ff0000;">nproffers</a>=' +
        nproffers + ' (' + real_proffers + ' real + ' + fake_proffers + ' manufactured)</font>';

    let doc_is_important_data = get_doc_is_important(availability_general, availability_from_json, availability_from_tuple,
        availability_from_full_proffers, launch_date, tier_engagement);
    let low_value_asin_s = 'This ASIN is ' +
        (doc_is_important_data[0] ? '<b>high value</b> (' : '<font color="#999999"><b>low value</b></font> (') +
        (doc_is_important_data[1] ? '<b>available</b>, ' : '<font color="#999999">not available</font>, ') +
        (doc_is_important_data[2] ? '<b>high engagement</b>, ' : '<font color="#999999">low engagement</font>, ') +
        (doc_is_important_data[3] ? '<b>recent</b>)' : '<font color="#999999">not recent</font>)');

    pre.innerHTML = '<font color="' + latest_color + '">Most recent update: <b>' + latest + '</b> (' +
        to_long_timestamp(latest/1000) + ')</font><br>' + nproffers_s + '<br>' + low_value_asin_s + '<br>';

    let table_location = text.indexOf(proffers_id_tag);
    if(table_location > -1) {
        table_location += proffers_id_tag.length;
        let text2 = document.createElement('pre');
        text2.innerHTML = text.substring(table_location);
        let proffer_table = document.createElement('table');
        proffer_table.className = 'proffer_table';
        proffer_table.id = 'proffer_table';
        proffer_table.style.tableLayout = 'auto';
        proffer_table.style.width = '100%';
        proffer_table.style.fontSize = 'small';
        proffer_table.setAttribute('cellpadding', '5');
        proffer_table.setAttribute('cellspacing', '0');
        // Pass all necessary data into the build_proffer_table function:
        proffer_table.proffers = proffers;
        proffer_table.profferAttributes = proffer_attributes;
        proffer_table.sortBy = (sort_by == '' ? name_s : sort_by);
        proffer_table.sortReverse = reverse;
        proffer_table.attrNames = {'name_s' : name_s, 'earliest_s' : earliest_s, 'latest_s' : latest_s};
        proffer_table.attributesSorted = Array.from(proffer_attributes);
        proffer_table.attributesSorted.sort();
        proffer_table.attributesSorted.unshift(name_s, earliest_s, latest_s);
        proffer_table.build_proffer_table = build_proffer_table;
        proffer_table.unhide_all_proffers = unhide_all_proffers;
        proffer_table.hide_proffer = hide_proffer;
        proffer_table.get_val = get_val;
        proffer_table.is_proffer_shown = is_proffer_shown;
        proffer_table.is_all_values_same = is_all_values_same;
        proffer_table.mark_similar_tds = mark_similar_tds;
        proffer_table.get_td_color = function(attr, all_values_same, is_sorting_by_attr) {
            return all_values_same ? 'fffee9' :
                is_sorting_by_attr ? 'ffe5eb' :
                    (attr == proffer_table.attrNames.name_s) ? 'fae387' :
                        (attr == proffer_table.attrNames.earliest_s) ? 'fff3bf' :
                            (attr == proffer_table.attrNames.latest_s) ? 'fff3bf' : 'fffcd0';
        };
        build_proffer_table(proffer_table);

        pre.innerHTML += text.substring(0, table_location);
        pre.parentNode.insertBefore(text2, pre.nextSibling);
        pre.parentNode.insertBefore(proffer_table, pre.nextSibling);
    } else {
        pre.innerHTML += text;
    }

    let versionsH3 = document.createElement('h3');
    versionsH3.innerHTML = 'Latest Updates By Attribute (as of ' + new Date().today() + ' ' + new Date().timeNow() + ')';
    let versionsPre = document.createElement('pre');
    let distinct_versions = Object.keys(versions);
    distinct_versions.sort();
    distinct_versions.reverse();
    distinct_versions.forEach(function(v) {
        versionsPre.innerHTML += version_with_decoded_timestamp(v) + ' ' + Array.from(versions[v]).join(', ') + '<br>';
    });
    pre.parentNode.insertBefore(versionsH3, next_sibling);
    pre.parentNode.insertBefore(versionsPre, next_sibling);
}

if(sable_explorer_links) {
    let first_h3 = document.getElementsByTagName('h3')[0];
    let newH3 = document.createElement('h3');
    newH3.innerHTML = 'Sable Data Explorer Links';
    let newPre = document.createElement('pre');
    newPre.innerHTML = '';
    sable_explorer_links.forEach(element => newPre.innerHTML += `<a href="${element.url}" target="_blank"><b>${element.scope}</b></a> - ${element.text}</br>`);
    let parent = first_h3.parentNode;
    parent.insertBefore(newPre, first_h3);
    parent.insertBefore(newH3, newPre);
}

if(dp_link) {
    let first_h3 = document.getElementsByTagName('h3')[0];
    let newH3 = document.createElement('h3');
    newH3.innerHTML = 'ASIN Links';
    let newPre = document.createElement('pre');
    newPre.innerHTML = '<a href="' + dp_link + '" target="_blank"><b>' + dp_link + '</b></a> - Detail Page<br>';
    let transformeddocs_link = String(window.location).replace('sdm.cgi', 'transformeddoc.cgi');
    newPre.innerHTML += '<a href="' + transformeddocs_link + '" target="_blank"><b>' + transformeddocs_link + '</b></a> - Transformed Doc<br>';
    let parent = first_h3.parentNode;
    parent.insertBefore(newPre, first_h3);
    parent.insertBefore(newH3, newPre);
}

function gotoHash() {
    if (location.hash) {
        let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        let isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        if(isChrome || isSafari) {
            window.location.href = location.hash;
        } else {
            window.location.hash = location.hash;
        }
    }
}

gotoHash();