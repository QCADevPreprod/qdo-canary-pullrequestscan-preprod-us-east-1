// ruleid: javascript-render-non-boolean-values
function Profile(props) {
return <div>
<h1>{ props.username }</h1> 
{ props.orders && <Orders /> } 
</div>;
}

// ruleid: javascript-render-non-boolean-values
function Profile(props) {
return <div>
<h1>{ props.username }</h1>   
{ props.orders && <MyComponent /> } 
</div>;
}

// ruleid: javascript-render-non-boolean-values
function Profile(props) {
return <div>
<h1>{ props.username }</h1>   
{ props.orders === 0 && <Orders /> } 
</div>;
}

// ok: javascript-render-non-boolean-values 
function Profile(props) {
return <div>
<h1>{ props.username }</h1>  
{ props.orders > 0 && <Orders /> }
</div>;
}

// ok: javascript-render-non-boolean-values
function Profile(props) {
return <div>
<h1>{ props.username }</h1>  
{ props.orders ? <Orders /> : null }
</div>;
}    