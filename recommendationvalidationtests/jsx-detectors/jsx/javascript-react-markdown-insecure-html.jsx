import ReactMarkdown from "react-markdown";
import htmlParser from "react-markdown/plugins/html-parser";
	 
	 // For more info on the processing instructions, see
	 // <https://github.com/aknuds1/html-to-react#with-custom-processing-instructions>
	 const parseHtml = htmlParser({
	   isValidNode: (node) => node.type !== 'script',
	   processingInstructions: [
	     /* ... */
	   ]
	 })
	 
	 // {fact rule=cross-site-scripting@v1.0 defects=1}
	 function bad1() {
	 // ruleid: javascript-react-markdown-insecure-html
	     return <ReactMarkdown astPlugins={[parseHtml]} allowDangerousHtml children={markdown} />;
	 }
	 // {/fact}
	 
	 // {fact rule=cross-site-scripting@v1.0 defects=1}
	 function bad2() {
	 // ruleid: javascript-react-markdown-insecure-html
	     return <ReactMarkdown astPlugins={[parseHtml]} escapeHtml={false} children={markdown} />;
	 }
	 // {/fact}

     // {fact rule=cross-site-scripting@v1.0 defects=1}
	 function bad2() {
	 // ruleid: javascript-react-markdown-insecure-html
	     return <ReactMarkdown astPlugins={[parseHtml]} transformLinkUri={uri} children={markdown} />;
	 }
	 // {/fact}

     // {fact rule=cross-site-scripting@v1.0 defects=1}
	 function bad2() {
	 // ruleid: javascript-react-markdown-insecure-html
	     return <ReactMarkdown astPlugins={[parseHtml]} transformImageUri={uri} children={markdown} />;
	 }
	 // {/fact}
	 
	 // {fact rule=cross-site-scripting@v1.0 defects=0}
	 function ok1() {
	 // ok: javascript-react-markdown-insecure-html
	     return <ReactMarkdown renderers={renderers} children={markdown} />;
	 }
	 // {/fact}
	 
	 // {fact rule=cross-site-scripting@v1.0 defects=0}
	 function ok2() {
	 // ok: javascript-react-markdown-insecure-html
	     return <ReactMarkdown renderers={renderers} escapeHtml={true} children={markdown} />;
	 }
	 // {/fact}