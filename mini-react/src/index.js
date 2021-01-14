import React from './react';
import ReactDOM from './react-dom';

const Test = props => {
  return (
    <h1>
      Test <span>{props.name}!</span>
    </h1>
  )
}

class Hello extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  addCount() {
    const { count } = this.state
    this.setState({
      count: count + 1
    })
  }

  render() {
    return (
      <div ha="lou">
        <Test name="function props" />
        hello world!
        <p>props: {this.props.initProps}</p>
        <div>state: {this.state.count}</div>
        <button onClick={this.addCount.bind(this)}> + </button>
      </div>
    )
  }
}

ReactDOM.render(
  <Hello initProps="this is props" />,
  document.getElementById("root")
)
