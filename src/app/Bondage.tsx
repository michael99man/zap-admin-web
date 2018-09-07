import * as React from 'react';
import { getZap } from '../subscriber';
import { OracleEndpointSelect } from './OracleEndpointSelect';
import { BNType } from '@zapjs/types';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { ZapSubscriber } from '@zapjs/subscriber';
import { loadSubscriber } from '../utils';

interface State {
  error: string;
  zap: BNType;
  loading: boolean;
  requiredZap: any;
  provider: ZapProvider;
  endpoint: string;
  dots: number;
  bond_txid: any;
}

export class Bondage extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      zap: null,
      loading: false,
      requiredZap: null,
      provider: null,
      endpoint: '',
      dots: null,
      bond_txid: null,
    };
    this.handleDotsChange = this.handleDotsChange.bind(this);
  }

  componentDidMount() {
    const { web3, address } = this.props;
    getZap(web3, address).then(zap => {
      this.setState({ zap: web3.utils.toBN(zap) });
    });
  }

  handleDotsChange(provider, endpoint, dots) {
    const { web3, address } = this.props;
    this.setState({requiredZap: null, provider, endpoint, dots, bond_txid: null});
    Promise.all([
      getZap(web3, address).then(e => web3.utils.toBN(e)),
      provider.getZapRequired({ endpoint, dots }).then(e => web3.utils.toBN(e)),
    ]).then(([zap, requiredZap]) => {
      this.setState({ zap, requiredZap });
    })
  }

  async handleBond() {
    this.setState({ loading: true });
    const { web3, address } = this.props;
    const { provider, endpoint, dots } = this.state;
    const subscriber: ZapSubscriber = await loadSubscriber(web3, address);
    const bond_txid: string | any = await subscriber.bond({ provider: provider.providerOwner, endpoint, dots });
    this.setState({
      loading: false,
      bond_txid,
      requiredZap: null,
    });
    getZap(web3, address).then(zap => {
      this.setState({ zap: web3.utils.toBN(zap) });
    });
  }

  render() {
    const { error, loading, zap, requiredZap, bond_txid } = this.state;
    const { web3, address } = this.props;
    return (
      <React.Fragment>
        {error && <div className="message message-error">{error}</div>}
        <TotalZap zap={zap} />
        <BondageForm handleDotsChange={this.handleDotsChange} web3={web3} address={address} loading={loading} />
        {requiredZap !== null && <div>
          <p>This will require {requiredZap.toString()} wei ZAP</p>
          {zap.lt(requiredZap)
            ? <div className="message message-error">Balance insufficent.</div>
            : <div className="form-group">
                <button disabled={loading} onClick={e => {this.handleBond()}} type="button">Bond</button>
              </div>
          }
        </div>}
        {bond_txid !== null && <div>
          <div className="message message-success">Bonded to endpoint.</div>
          <p>Transaction Info: {typeof bond_txid == 'string' ? bond_txid : bond_txid.transactionHash}</p>
        </div>}
      </React.Fragment>
    );
  }
}

const TotalZap = ({zap}) => (
  zap !== null && <p>You have {zap.toString()} ZAP</p>
);

class BondageForm extends React.PureComponent<{handleDotsChange: any; loading: boolean, web3: any, address: string}> {

  timeout
  state = {bondedDots: null, endpoint: null, provider: null, dots: undefined};

  constructor(props) {
    super(props);
    this.handleProviderEndpointSelect = this.handleProviderEndpointSelect.bind(this);
    this.handleDotsChange = this.handleDotsChange.bind(this);
  }

  handleProviderEndpointSelect(e) {
    this.setState({bondedDots: null});
    if (!e) return;
    const {provider, endpoint} = e;
    this.setState({provider, endpoint});
    provider.getBoundDots({ subscriber: this.props.address, endpoint}).then(dots => {
      this.setState({bondedDots: dots});
    });
  }

  handleDotsChange(e) {
    const dots = Number(e.target.value);
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const { provider, endpoint } = this.state;
      this.props.handleDotsChange(provider, endpoint, dots);
    }, 500);
  }

  render() {
    const { loading, web3, address } = this.props;
    const { bondedDots, dots } = this.state;
    return (
      <div className={loading ? 'disabled' : undefined}>
        <OracleEndpointSelect web3={web3} address={address} onSelect={this.handleProviderEndpointSelect}></OracleEndpointSelect>
        {bondedDots !== null && <div>
          <div className="form-group">
            <label htmlFor="dots">You have {bondedDots} DOTs bound. How many would you like to bond?</label>
            <input type="number" value={dots} onChange={this.handleDotsChange} />
          </div>
        </div>}
      </div>
    );
  }
}
