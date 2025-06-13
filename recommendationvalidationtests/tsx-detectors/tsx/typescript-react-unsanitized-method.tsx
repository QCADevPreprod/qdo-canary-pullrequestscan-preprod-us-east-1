const DOMPurify = require('dompurify');
const sanitizeHtml = require('sanitize-html');
const ISODOMPurify = require("isomorphic-dompurify");

function Test1({input}) {
  // ruleid: typescript-react-unsanitized-method
    this.ref.insertAdjacentHTML('afterend', input.foo);
  }
  
  function Test2({input}) {
  // ruleid: typescript-react-unsanitized-method
    document.write(input.foo);
  }

  function Test2({input}) {
  // ruleid: typescript-react-unsanitized-method
    document.writeln(input.varr);
  }

 function Test3 () {
  // ok: typescript-react-unsanitized-method
    document.writeln(input);
  }
  
  function OkTest1 () {
  // ok: typescript-react-unsanitized-method
    this.ref.insertAdjacentHTML('afterend', '<div id="two">two</div>');
  }
  
  function OkTest2 () {
  // ok: typescript-react-unsanitized-method
    document.write("<h1>foobar</h1>");
  }
  
  function OkTest3 () {
  // ok: typescript-react-unsanitized-method
    document.writeln("<p>foobar</p>");
  }
  
  // ok: typescript-react-unsanitized-method
	 let y = <a href={this.docUrl('setup.html', this.props.language)}></a>;
	 
 // ok: typescript-react-unsanitized-method
	 let c = <a href={this.docUrl('example-slideshow.html', this.props.language)}></a>;
	 
 // ok: typescript-react-unsanitized-method
	 let d = <a href={this.props.config.baseUrl + 'blog'}>Blog</a>;
	 
 // ok: typescript-react-unsanitized-method
	 let xx = <a href={editUrl} className="button"></a>;
	 
 // ok: typescript-react-unsanitized-method
	 let yy = <a className="Button" href={`joplin://x-callback-url/openNote?id=${encodeURIComponent(this.state.newNoteId)}`}
	         target="_blank"
	         onClick={() => this.setState({ newNoteId: null })}
	         > Open newly created note </a>;
	 
 // ok: typescript-react-unsanitized-method
	 let xyz = <a href={DOMPurify.sanitize(this.props.language)}>Blog</a>;  
	 
 // ok: typescript-react-unsanitized-method
	 let abc = <a href={sanitizeHtml(this.props.config.baseUrl)}>getting started</a>;
	 
 // ok: typescript-react-unsanitized-method
	 let xyz = <a href={ISODOMPurify.sanitize(this.state.newNoteId)}></a>; 