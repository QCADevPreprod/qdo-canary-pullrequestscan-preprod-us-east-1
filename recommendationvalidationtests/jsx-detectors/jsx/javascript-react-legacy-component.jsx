class Test1 extends React.Component {
    state = {
      value: ''
    };
  // {fact rule=react-legacy-component@v1.0 defects=1}
  // ruleid: javascript-react-legacy-component
    componentWillReceiveProps(nextProps) {
      this.setState({ value: nextProps.value });
    }
    handleChange = (e) => {
      this.setState({ value: e.target.value });
    };
    render() {
      return (
        <input
          value={this.state.value}
          onChange={this.handleChange}
        />
      );
    }
  }
  // {/fact}
  
  // {fact rule=react-legacy-component@v1.0 defects=1}
  class ExampleComponent extends React.Component {
    state = {};
  // ruleid: javascript-react-legacy-component
    componentWillMount() {
      this.setState({
        currentColor: this.props.defaultColor,
        palette: 'rgb',
      });
    }
  }
  // {/fact}
  
  // {fact rule=react-legacy-component@v1.0 defects=1}
  class ExampleComponent extends React.Component {
  // ruleid: javascript-react-legacy-component    
    componentWillUpdate(nextProps, nextState) {
      if (
        this.state.someStatefulValue !==
        nextState.someStatefulValue
      ) {
        nextProps.onChange(nextState.someStatefulValue);
      }
    }
  }
  // {/fact}
  
  // {fact rule=react-legacy-component@v1.0 defects=0}
  class OkComponent1 extends Component {
  // ok: javascript-react-legacy-component
    componentDidMount() {
      this.node.scrollIntoView();
    }
  
    render() {
      return <div ref={node => this.node = node} />
    }
  }
  // {/fact}
  
  // {fact rule=react-legacy-component@v1.0 defects=0}
  class OkComponent3 extends React.Component {
    state = {
      value: ''
    };
  // ok: javascript-react-legacy-component
    getDerivedStateFromProps(nextProps) {
      this.setState({ value: nextProps.value });
    }
    handleChange = (e) => {
      this.setState({ value: e.target.value });
    };
    render() {
      return (
        <input
          value={this.state.value}
          onChange={this.handleChange}
        />
      );
    }
  }
  // {/fact}
  
  // {fact rule=react-legacy-component@v1.0 defects=0}
  class OkComponent3 extends React.Component {
  // ok: javascript-react-legacy-component    
    componentDidUpdate(prevProps, prevState) {
      if (
        this.state.someStatefulValue !==
        prevState.someStatefulValue
      ) {
        this.props.onChange(this.state.someStatefulValue);
      }
    }
  }
  // {/fact}