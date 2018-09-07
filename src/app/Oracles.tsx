import * as React from 'react';
import { listOracles } from '../subscriber';

export class Oracles extends React.PureComponent<{web3: any}> {
  state = {oracles: [], loading: true};
  componentDidMount() {
    this.setState
    listOracles(this.props.web3).then(oracles => {
      this.setState({oracles, loading: false});
    });
  }
  render() {
    const {oracles, loading} = this.state;
    return (
      loading ? 'Loading...' : <ul className="oracles-list">
        {oracles.map(oracle => <li key={oracle.address + oracle.endpoint}><Oracle {...oracle}></Oracle></li>)}
      </ul>
    );
  }
}

export const Oracle = ({provider, address, endpoint, curve}) => (
  <div className="oracle">
    <div>Provider: {provider} / Endpoint: {endpoint}</div>
    <div>Address: {address}</div>
    <div>Curve: {curve}</div>
  </div>
);