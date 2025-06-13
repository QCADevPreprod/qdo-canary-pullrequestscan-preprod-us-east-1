<>  
// ruleid: javascript-avoid-anchor-tag-as-btn
<a href="#">Do something</a>

// ruleid: javascript-avoid-anchor-tag-as-btn
<a href="javascript:void(0)" role="button">Do another thing</a>

// ruleid: javascript-avoid-anchor-tag-as-btn
<a href="javascript:doSomething(0)">Do another thing</a>

// ruleid: javascript-avoid-anchor-tag-as-btn
<a href="javascript:void(0)" onClick={foo}>Perform action</a>

// ok: javascript-avoid-anchor-tag-as-btn
<a href="#section" onClick={foo}>Perform action</a>

// ok: javascript-avoid-anchor-tag-as-btn
<a href="https://www.google.com/">Do another thing</a>

// ok: javascript-avoid-anchor-tag-as-btn
<a href="#any_text" onClick={foo}>Perform action</a>
</>