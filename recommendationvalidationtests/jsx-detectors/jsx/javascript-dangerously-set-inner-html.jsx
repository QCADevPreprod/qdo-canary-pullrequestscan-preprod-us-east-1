function MyComponent() {   
return (
// ruleid: javascript-dangerously-set-inner-html      
<div dangerouslySetInnerHTML={{ __html: "HTML" }}>
 Children
</div>
);
}
    
function MyComponent() {     
return (
// ok: javascript-dangerously-set-inner-html    
<div dangerouslySetInnerHTML={{ __html: "HTML" }}>
</div>
);
}
    
function MyComponent() {    
return (
// ok: javascript-dangerously-set-inner-html    
<div>
 Children
</div>
);
}