import React, { Component } from 'react';

class App extends Component {
  state = {
    count: 1
  };

  handleClick = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        {this.props.name}

        <button onClick={this.handleClick}>
          Click me
        </button>
        {this.state.count}
      </div>
    );
  }
}

export default App;
