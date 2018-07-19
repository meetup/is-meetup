import React, { Component } from 'react';
import moment from 'moment';
import StatusBar from './StatusBar';
import Footer from './Footer';
import Modal from './Modal';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    response: '',
    showModal: false,
    events: []
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const monitors = await fetch('/api/monitors');
    const history = await fetch('/api/history');
    const monitorsBody = await monitors.json();
    const historyBody = await history.json();

    return {
      monitors: monitorsBody,
      history: historyBody
    };
  };

  hideModal = () => {
    this.setState({
      showModal: false,
      events: []
    });
  }

  displayModal = (events) => {
    this.setState({
      showModal: true,
      events
    });
  }

  render() {
    const { monitors = {}, history = {} } = this.state.response;
    const { products = [] } = history;

    return (
      <div className="App">
        <section className="App-wrapper">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">system status</h1>
          </header>
          <div className="App-status-box">
            <div className="App-status-box-header">
              <h2>
                <span className="App-current-status-circle success" />All services are online.
              </h2>
              <p>As of {moment().format('MMMM Do YYYY, h:mm a')}</p>
            </div>
            {products.map((product, key) => (
              <StatusBar displayModal={this.displayModal} key={key} {...product} />
            ))}
          </div>
          <Footer />
        </section>
        {this.state.showModal &&
          <Modal>
            <button className="App-close" onClick={this.hideModal}>
              X
            </button>
            <div>
              {this.state.events.map(event => {
                return (
                  <a
                    className="Modal-link"
                    href={`https://app.datadoghq.com${event.url}`}
                    target="_blank">
                    <span className="Modal-datetime">
                      {event.date_happened_formatted}
                    </span>
                    <span className={`Modal-badge-${event.alert_type}`}>
                      {event.alert_type}
                    </span>
                    {event.title}
                  </a>
                );
              })}
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default App;
