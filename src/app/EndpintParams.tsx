import * as React from 'react';
import { loadProvider } from '../utils';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { InputAutocomplete } from './InputAutocomplete';
import { getEndpointParams, setEndpointParams } from '../provider';

interface State {
  provider: ZapProvider;
  error: string;
  success: string;
  params: string;
  endpoints: string[];
  loading: boolean;
  endpoint: string;
}

export class EndpointParams extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      error: null,
      success: null,
      params: '',
      loading: false,
      endpoints: [],
      endpoint: '',
    };
    this.handleParamsChange = this.handleParamsChange.bind(this);
  }

  componentDidMount() {
    loadProvider(this.props.web3, this.props.address).then(provider => {
      this.setState({
        provider,
        endpoints: [],
      });
      this.updateProviderEndpoints(provider);
    });
  }

  updateProviderEndpoints(provider: ZapProvider) {
    if (!provider) return;
    provider.getEndpoints().then(endpoints => {
      this.setState({endpoints});
    });
  }

  loadParams(endpoint) {
    if (!endpoint) return;
    getEndpointParams(this.state.provider, endpoint).then(params => {
      this.setState({params: params.join('\n')});
    }).catch(console.error);
  }

  handleParamsChange(e) {
    this.setState({params: e.target.value});
  }

  handleEndpointSelect(endpoint) {
    this.setState({endpoint});
    this.loadParams(endpoint);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {endpoint, provider, params} = this.state;
    this.setState({
      error: null,
      success: null,
      loading: true,
    });
    setEndpointParams(provider, endpoint, params.split('\n').map(e => e.trim()).filter(e => e)).then(txid => {
      console.log('txid', txid);
      this.setState({
        loading: false,
        success: 'Params has been set',
      });
      this.loadParams(endpoint);
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message,
        loading: false,
      });
    });
  }

  render() {
    const {success, error, endpoints, endpoint, loading, params} = this.state;
    const endpointOptions = endpoints.map(endpoint => ({name: endpoint, value: endpoint}));
    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
        {success && <div className="message message-success">{success}</div>}
        {error && <div className="message message-error">{error}</div>}
        <div className="form-group">
          <label>Endpoint</label>
          <InputAutocomplete
            disabled={!endpointOptions.length}
            placehoder={endpointOptions.length ? 'Select endpoint' : 'Provider has no endpoints'}
            value={endpoint}
            options={endpointOptions}
            onSelect={e => {this.handleEndpointSelect(e)}}
          />
        </div>
        {endpoint && <div className="form-group">
          <label htmlFor="endpointParams">Input endpoint parameters one per line</label>
          <textarea value={params} onChange={this.handleParamsChange} id="endpointParams" name="endpointParams"></textarea>
        </div>}
        <div className="form-group">
          <button type="submit">Set endpoint params</button>
        </div>
      </form>
    );
  }
}
