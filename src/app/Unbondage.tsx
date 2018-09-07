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
  bondedDots: any;
  provider: ZapProvider;
  endpoint: string;
  dots: number;
  bond_txid: any;
}

export class Unbondage extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      zap: null,
      loading: false,
      bondedDots: null,
      provider: null,
      endpoint: '',
      dots: null,
      bond_txid: null,
    };
    this.handleProviderEndpointSelect = this.handleProviderEndpointSelect.bind(this);
    this.handleDotsChange = this.handleDotsChange.bind(this);
    this.handleUnbond = this.handleUnbond.bind(this);
  }

  componentDidMount() {
    const { web3, address } = this.props;
    getZap(web3, address).then(zap => {
      this.setState({ zap: web3.utils.toBN(zap) });
    });
  }

  handleDotsChange(e) {
    this.setState({dots: Number(e.target.value)});
  }

  handleProviderEndpointSelect(e) {
    if (!e) return;
    const {provider, endpoint} = e;
    this.setState({error: null, bondedDots: null, provider, endpoint, bond_txid: null});
    this.updateZapAndDots(provider, endpoint);
  }

  updateZapAndDots(provider, endpoint) {
    const { web3, address } = this.props;
    Promise.all([
      getZap(web3, address).then(e => web3.utils.toBN(e)),
      provider.getBoundDots({ subscriber: this.props.address, endpoint}).then(Number),
    ]).then(([zap, bondedDots]) => {
      console.log('bondedDots', bondedDots);
      const error = bondedDots > 0 ? null : 'You have no DOTs bound to this provider.';
      this.setState({ zap, bondedDots, error });
    }).catch(e => { this.setState({error: e.message}) });
  }

  async handleUnbond(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const { web3, address } = this.props;
    const { provider, endpoint, dots } = this.state;
    const subscriber: ZapSubscriber = await loadSubscriber(web3, address);
    const bond_txid: string | any = await subscriber.unBond({ provider: provider.providerOwner, endpoint, dots });
    this.setState({
      loading: false,
      bond_txid,
      bondedDots: null,
    });
    this.updateZapAndDots(provider, endpoint);
  }

  render() {
    const { error, loading, zap, bondedDots, bond_txid, dots } = this.state;
    const { web3, address } = this.props;
    return (
      <React.Fragment>
        {error && <div className="message message-error">{error}</div>}
        {zap !== null && <p>You have {zap.toString()} ZAP</p>}
        <form className={loading ? 'disabled' : undefined} onSubmit={this.handleUnbond}>
          <OracleEndpointSelect web3={web3} address={address} onSelect={this.handleProviderEndpointSelect}></OracleEndpointSelect>
          {bondedDots !== null && bondedDots > 0 && <div>
            <div className="form-group">
              <label htmlFor="dots">You have {bondedDots} DOTs bound. How many would you like to bond?</label>
              <input type="number" value={dots} onChange={this.handleDotsChange} />
            </div>
            <div className="form-group">
              <button type="submit">Unbond</button>
            </div>
          </div>}
        </form>
        {bond_txid !== null && <div>
          <div className="message message-success">Bonded to endpoint.</div>
          <p>Transaction Info: {typeof bond_txid == 'string' ? bond_txid : bond_txid.transactionHash}</p>
        </div>}
      </React.Fragment>
    );
  }
}

