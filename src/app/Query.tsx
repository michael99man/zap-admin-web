import * as React from 'react';
import { getZap } from '../subscriber';
import { OracleEndpointSelect } from './OracleEndpointSelect';
import { BNType, DEFAULT_GAS } from '@zapjs/types';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { ZapSubscriber } from '@zapjs/subscriber';
import { loadSubscriber } from '../utils';
import { getQueryResponse } from '../provider';

interface State {
  error: string;
  zap: BNType;
  loading: boolean;
  bondedDots: any;
  provider: ZapProvider;
  endpoint: string;
  dots: number;
  txid: any;
  queryResponse: any;
}

export class Query extends React.PureComponent<{web3: any; address: string}, State> {

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
      txid: null,
      queryResponse: null,
    };
    this.handleProviderEndpointSelect = this.handleProviderEndpointSelect.bind(this);
    this.handleDotsChange = this.handleDotsChange.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
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
    this.setState({error: null, bondedDots: null, provider, endpoint, txid: null});
    this.updateZapAndDots(provider, endpoint);
  }

  updateZapAndDots(provider, endpoint) {
    const { web3, address } = this.props;
    Promise.all([
      getZap(web3, address).then(e => web3.utils.toBN(e)),
      provider.getBoundDots({ subscriber: this.props.address, endpoint}).then(Number),
    ]).then(([zap, bondedDots]) => {
      const error = bondedDots > 0 ? this.state.error : 'You do not have any bound dots to this provider.';
      this.setState({ zap, bondedDots, error });
    }).catch(e => { this.setState({error: e.message}) });
  }

  async handleQuery(e) {
    e.preventDefault();
    const form = e.target;
    const { endpointParams, query } = form;
    const { web3, address } = this.props;
    const { provider, endpoint } = this.state;
    this.setState({
      loading: true,
      txid: null,
      error: null,
      queryResponse: null,
    });
    const subscriber: ZapSubscriber = await loadSubscriber(web3, address);
    let txid: string | any;
    try {
      txid = await subscriber.queryData({
        provider: provider.providerOwner,
        query: query.value,
        endpoint,
        endpointParams: endpointParams.value.split('\n').map(e => e.trim()).filter(e => !!e),
        gas: DEFAULT_GAS.toNumber()
      });
      this.setState({
        txid,
        queryResponse: null,
      });
      this.updateZapAndDots(provider, endpoint);
    } catch(error) {
      this.setState({
        loading: false,
        error: error.message,
      });
      this.updateZapAndDots(provider, endpoint);
      return;
    }

    // Listen to response
    try {
      const id = txid.events['Incoming'].returnValues['id']
      console.log('Query ID generate was', '0x' + id.toString(16));
      //const response = await getQueryResponse(subscriber, {id});
        subscriber.listenToOffchainResponse({},(err:any,response:any)=>{
          if(err){
            console.error("error response from provider : ", err)
          }
            console.log("Response event from provider : ",response)
            this.setState({
                loading: false,
                queryResponse: response.returnValues.response1,
            });
            console.log('query response', response);
        })
    } catch (error) {
      console.log('query error', error.message);
      this.setState({
        loading: false,
        error: error.message,
      });
    }
  }

  render() {
    const { error, loading, zap, bondedDots, txid, queryResponse } = this.state;
    const { web3, address } = this.props;
    return (
      <React.Fragment>
        {error && <div className="message message-error">{error}</div>}
        {zap !== null && <p>You have {zap.toString()} ZAP</p>}
        <form className={loading ? 'disabled' : undefined} onSubmit={this.handleQuery}>
          <OracleEndpointSelect web3={web3} address={address} onSelect={this.handleProviderEndpointSelect}></OracleEndpointSelect>
          {bondedDots !== null && bondedDots > 0 && <div>
            <p>You have {bondedDots} DOTs bound to this provider's endpoint. 1 DOT will be used.</p>
            <div className="form-group">
              <label htmlFor="endpointParams">Input your provider's endpoint paramaters one per line</label>
              <textarea id="endpointParams" name="endpointParams"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="query">Query</label>
              <textarea id="query" name="query"></textarea>
            </div>
            <div className="form-group">
              <button type="submit">Query</button>
            </div>
          </div>}
        </form>
        {txid !== null && <div>
          <p>Queried provider. Transaction Hash: {typeof txid == 'string' ? txid : txid.transactionHash}</p>
        </div>}
        {queryResponse !== null && <div>{queryResponse}</div>}
      </React.Fragment>
    );
  }
}

