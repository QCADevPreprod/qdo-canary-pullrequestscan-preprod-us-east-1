import styled from "styled-components";

// ok: javascript-react-styled-components
const ArbitraryComponent = styled.div`
  color: blue;
`
// ok: javascript-react-styled-components
const ArbitraryComponent2 = styled(ArbitraryComponent)`
  color: blue;
`

function FunctionalComponent() {
  // ruleid: javascript-react-styled-components
  const ArbitraryComponent3 = styled.div`
    color: blue;
  `
  return <ArbitraryComponent3 />
}

function FunctionalComponent2() {
  // ruleid: javascript-react-styled-components
  const ArbitraryComponent3 = styled(FunctionalComponent)`
    color: blue;
  `
  return <ArbitraryComponent3 />
}

class ClassComponent {
  public render() {
    // ruleid: javascript-react-styled-components
    const ArbitraryComponent4 = styled.div`
        color: blue;
    `
    return <ArbitraryComponent4 />
  }
}
