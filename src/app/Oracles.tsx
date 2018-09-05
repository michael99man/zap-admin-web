import * as React from 'react';

export const Oracles = ({oracles}) => (
  <ul className="oracles-list">
    {oracles.map(oracle => <li key={oracle.address + oracle.endpoint}><Oracle {...oracle}></Oracle></li>)}
  </ul>
);

export const Oracle = ({provider, address, endpoint, curve}) => (
  <div className="oracle">
    <div>Provider: {provider} / Endpoint: {endpoint}</div>
    <div>Address: {address}</div>
    <div>Curve: {curve}</div>
  </div>
);