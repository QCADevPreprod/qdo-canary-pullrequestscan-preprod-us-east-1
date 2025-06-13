import {
  SEMGREP_REPO,
} from "../../util";
import SEMGREP_REPO1 from "../../util1";

const DOMPurify = require('dompurify');
const sanitizeHtml = require('sanitize-html');
const ISODOMPurify = require("isomorphic-dompurify");

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let zzz = <Foo className={"foobar"} href={getQuery()} />;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=1}
function test1(input) {
// ruleid: javascript-react-href-var
  const params = {href: input.a};
  return React.createElement("a", params);
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=1}
function test2(input) {
// ruleid: javascript-react-href-var
  const params = {href: input.varr};
  return React.createElement("a", params);
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=1}
function test3(input) {
// ruleid: javascript-react-href-var
  const params = {href: input.hi};
  return React.createElement("a", params);
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
{collaborationSectionData.paragraphs.map((item, i) => (
  <div>  <a href={item.value}>click</a></div>
))}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let zzz = <Foo className={"foobar"} href={`${input}`} />;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let zzz = <Foo className={"foobar"} href={SEMGREP_REPO} />;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let zzz = <Foo className={"foobar"} href={SEMGREP_REPO1} />;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
function test1(input) {
// ok: javascript-react-href-var
  if(input.startsWith("https:")) {
    const params = {href: input};
    return React.createElement("a", params);
  }
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
function test2(input) {
  // ok: javascript-react-href-var
  const params = {href: "#"+input};
  return React.createElement("a", params);
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
function test2(input) {
  // ok: javascript-react-href-var
  const params = {href: "#"+input};
  return React.createElement("a", params);
}
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
const b = <a className={"foobar"} href={"http://www.example.com"}></a>;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let x = <a className={"foobar"} href={"#"+input}></a>;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
// ok: javascript-react-href-var
let x = <a className={"foobar"} href={`#${input}`}></a>;
// {/fact}

// {fact rule=cross-site-scripting@v1.0 defects=0}
function okTest1() {
// ok: javascript-react-href-var
  return React.createElement("a", {href: "https://www.example.com"});
}
// {/fact}

// ok: javascript-react-href-var
let y = <a href={this.docUrl('setup.html', this.props.language)}></a>;

// ok: javascript-react-href-var
let c = <a href={this.docUrl('example-slideshow.html', this.props.language)}></a>;

// ok: javascript-react-href-var
let d = <a href={this.props.config.baseUrl + 'blog'}>Blog</a>;

// ok: javascript-react-href-var
let xx = <a href={editUrl} className="button"></a>;

// ok: javascript-react-href-var
let yy = <a className="Button" href={`joplin://x-callback-url/openNote?id=${encodeURIComponent(this.state.newNoteId)}`}
        target="_blank"
        onClick={() => this.setState({ newNoteId: null })}
        > Open newly created note </a>;

// ok: javascript-react-href-var
let xyz = <a href={DOMPurify.sanitize(this.props.language)}>Blog</a>;  

// ok: javascript-react-href-var
let abc = <a href={sanitizeHtml(this.props.config.baseUrl)}>getting started</a>;

// ok: javascript-react-href-var
let xyz = <a href={ISODOMPurify.sanitize(this.state.newNoteId)}></a>; 