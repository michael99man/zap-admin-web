import * as React from 'react';
import Menu from './Menu';
import { ViewsEnum } from '../views.enum';
import { Oracles } from './Oracles';
import './app.css';
import { CurveInit } from './CurveInit';
import { GetEndpoint } from './GetEndpoint';
import { Bondage } from './Bondage';
import { getZap, getEth } from '../subscriber';
import { ZapProvider } from '@zapjs/provider/lib/src';

interface AppProps {
  defaultProvider: ZapProvider;
  address: string;
  web3: any;
  defaultView: ViewsEnum;
}

interface AppState {
  view: ViewsEnum;
  provider: ZapProvider;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = { view: props.defaultView, provider: this.props.defaultProvider};
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }
  handleMenuChange(view) {
    this.setState({view});
  }
  render() {
    const { address, web3 } = this.props;
    const { view, provider } = this.state;
    return (
      <React.Fragment>
        <header>
          <Address address={address}></Address>
          <Provider providerTitle={provider.title}></Provider>
        </header>
        <main>
          <aside>
            <Menu view={view} providerTitle={provider.title} onMenuChange={this.handleMenuChange}></Menu>
          </aside>
          <MainSection address={address} web3={web3} view={view}></MainSection>
        </main>
      </React.Fragment>
    );
  }
};

class MainSection extends React.PureComponent<{address: string; view: ViewsEnum; web3: any}> {
  render() {
    const {address, view, web3} = this.props;
    let main = null;
    let className = view ? view.toLowerCase() : undefined;
    switch (view) {
      case ViewsEnum.MAIN:
        main = <Info address={address} web3={web3} ></Info>;
        break;
      case ViewsEnum.ORACLES:
        main = <Oracles web3={web3}></Oracles>;
        break;
      case ViewsEnum.INIT_CURVE:
        main = <CurveInit web3={web3} address={address}></CurveInit>;
        break;
      case ViewsEnum.GET_ENDPOINT:
        main = <GetEndpoint web3={web3} address={address}></GetEndpoint>;
        break;
      case ViewsEnum.BONDAGE:
        main = <Bondage web3={web3} address={address}></Bondage>;
        break;
    }
    return <section className={className}>{main}</section>;
  }
}

const Address = ({address}) => (
  <div className="address">Address: {address}</div>
);

class Info extends React.PureComponent<{address: string, web3: any}> {
  state = {eth: '', zap: ''};
  componentDidMount() {
    const {web3, address} = this.props;
    getZap(web3, address).then(zap => { this.setState({zap}); })
    getEth(web3, address).then(eth => { this.setState({eth}); })
  }
  render() {
    const {eth, zap} = this.state;
    return (
      <React.Fragment>
        <div>Address: {this.props.address}</div>
        <div>ETH Balance: {eth} wei</div>
        <div>ZAP Balance: {zap} wei ZAP</div>
      </React.Fragment>
    )
  }
}

const Provider = ({providerTitle}) => (
  <div>
    {providerTitle ? 'Found provider: ' + providerTitle : 'This account is currently not setup as a provider'}
  </div>
);

export default App;
