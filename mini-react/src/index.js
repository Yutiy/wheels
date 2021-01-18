import React from './react';
import ReactDOM from './react-dom/render';

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

  componentDidMount() {
    for (let i = 0; i < 100; i++) {
      // this.setState(prevState => {
      //   console.log(prevState.count);
      //   return {
      //     count: prevState.count + 1
      //   }
      // });
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.count > 5) {
      alert('shouldComponentUpdate中限制了更新');
      return false;
    }
    return true;
  }

  addCount() {
    const { count } = this.state
    this.setState({ count: count + 1 })
  }

  render() {
    const { initProps } = this.props;

    return (
      <div ha="lou">
        <Test name="function props" />
        hello world!
        <p>props: {initProps}</p>
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
