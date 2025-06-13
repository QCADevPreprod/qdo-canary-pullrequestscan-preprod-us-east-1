const DOMPurify = require('dompurify');
const sanitizeHtml = require('sanitize-html');
const ISODOMPurify = require("isomorphic-dompurify");
function Test2(input) {
  // ruleid: typescript-react-unsanitized-property
    ReactDOM.findDOMNode(this.someRef).outerHTML = input.value;
  }

  function Test3(input) {
  // ruleid: typescript-react-unsanitized-property
    const mode= ReactDOM.findDOMNode(this.someRef).innerHTML = input.a;
  }

   function Test4() {
  // ruleid: typescript-react-unsanitized-property
    const mode= ReactDOM.createRef(this.someRef).innerHTML = props.data;
  }
  
  function OkTest1() {
  // ok: typescript-react-unsanitized-property
    this.element.innerHTML = "<a href='/about.html'>About</a>";
  }
  
  function OkTest2() {
  // ok: typescript-react-unsanitized-property
    ReactDOM.findDOMNode(this.someRef).outerHTML = "<a href='/about.html'>About</a>";
  }
	 	 
 // ok: typescript-react-unsanitized-property
	let xyz = <a href={DOMPurify.sanitize(this.props.language)}>Blog</a>;  
	 	 
 // ok: typescript-react-unsanitized-property
	let abc = <a href={sanitizeHtml(this.props.config.baseUrl)}>getting started</a>;
	 	 
 // ok: typescript-react-unsanitized-property
	let xyz = <a href={ISODOMPurify.sanitize(this.state.newNoteId)}></a>; 