import * as React from 'react';
import { Fragment } from 'react';
import Menu from './Menu';
import { ViewsEnum } from '../views.enum';
import { Oracles } from './Oracles';
import './app.css';
import { CurveInit } from './CurveInit';

export const App = ({state, dispatch}) => {
  const { provider, view, address } = state;
  return (
    <Fragment>
      <header>
        <Address address={address}></Address>
        <Provider {...provider}></Provider>
      </header>
      <main>
        <aside>
          {provider.loaded && <Menu view={view} providerTitle={provider.title} dispatch={dispatch}></Menu>}
        </aside>
        <MainSection {...state}></MainSection>
      </main>
    </Fragment>
  );
};

const MainSection = ({info, address, view, oracles, viewLoading, web3}) => {
  let main = null;
  let className = view ? view.toLowerCase() : undefined;
  switch (view) {
    case ViewsEnum.MAIN:
      main = <Info address={address} {...info} ></Info>;
      break;
    case ViewsEnum.ORACLES:
      main = <Oracles oracles={oracles}></Oracles>;
      break;
    case ViewsEnum.INIT_CURVE:
      main = <CurveInit web3={web3} address={address}></CurveInit>;
      break;
  }
  return <section className={className}>{viewLoading ? 'Loading ...' : main}</section>;
};

const Address = ({address}) => (
  <div className="address">Address: {address}</div>
);

const Info = ({address, eth, zap}) => (
  <Fragment>
    <div>Address: {address}</div>
    <div>ETH Balance: {eth} wei</div>
    <div>ZAP Balance: {zap} wei ZAP</div>
  </Fragment>
);

const Provider = ({loaded, title}) => (
  <div>
    {loaded && <div>
      {title ? 'Found provider: ' + title : 'This account is currently not setup as a provider'}
    </div>}
  </div>
);

export default App;