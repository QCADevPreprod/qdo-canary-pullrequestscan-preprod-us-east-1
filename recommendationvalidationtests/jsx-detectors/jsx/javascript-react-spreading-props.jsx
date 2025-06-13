function Test1(props) {
// ruleid: javascript-react-spreading-props
    const el = <App {...props} />;
    return el;
}

function Test2(props) {
// ruleid: javascript-react-spreading-props
    const el = <MyCustomComponent {...props} some_other_prop={some_other_prop} />;
    return el;
}

const MyComponent =({ otherProps }) =>{
// ruleid: javascript-react-spreading-props
    return <div {...otherProps}>Hello, World!</div>
}

function Test2(props, otherProps) {
    const {src, alt} = props;
    const {one_prop, two_prop} = otherProps;
// ok: javascript-react-spreading-props
    return <MyCustomComponent other-props={other-props} />;
}

function Test2(props, otherProps) {
    const {src, alt} = props;
    const {one_prop, two_prop} = otherProps;
// ok: javascript-react-spreading-props
    return <MyCustomComponent one_prop={one_prop} two_prop={two_prop} />;
}