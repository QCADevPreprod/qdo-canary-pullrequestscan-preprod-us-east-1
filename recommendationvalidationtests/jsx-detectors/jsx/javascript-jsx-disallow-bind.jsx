
<div>
// ruleid: javascript-jsx-disallow-bind
<Component onClick={this._handleClick.bind(this)}></Component>

// ruleid: javascript-jsx-disallow-bind
<Component onClick={() => handleClick()}> </Component>
</div>

function handleClick() {
    //...
}
// ok: javascript-jsx-disallow-bind
<Component onClick={handleClick}></Component>



class Alphabet extends React.Component {
    handleClick(letter) {
        console.log(`clicked ${letter}`);
    }
    render() {
        return (<div><ul>
            {letters.map(letter =>
            // ok: javascript-jsx-disallow-bind
                <li key={letter} onClick={() => this.handleClick(letter)}>{letter}</li>
            )}
        </ul></div>)
    }
}


class Alphabet extends React.Component {
    handleClick(letter) {
        console.log(`clicked ${letter}`);
    }
    render() {
        return (<div><ul>
            {letters.map(letter =>
            // ok: javascript-jsx-disallow-bind
                <Letter key={letter} letter={letter} handleClick={this.handleClick}></Letter>
            )}
        </ul></div>)
    }
}


class Letter extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        this.props.handleClick(this.props.letter);
    }
    render() {
        // ok: javascript-jsx-disallow-bind
        return <li onClick={this.handleClick}> {this.props.letter} </li>
    }
}


function Letter({ handleClick, letter }) {
    const onClick = React.useCallback(() => handleClick(letter), [letter])
        // ok: javascript-jsx-disallow-bind
    return <li onClick={onClick}>{letter}</li>
}

// ok: javascript-jsx-disallow-bind
__d(function(n,t,o,r){"use strict";var u,e=t(44);u=e.now?function(){return e.now()}:function(){return Date.now()},o.exports=u},43);