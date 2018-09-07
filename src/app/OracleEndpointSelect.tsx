import * as React from 'react';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { InputAutocomplete } from './InputAutocomplete';
import { getProvidersWithTitles } from '../subscriber';
import { loadProvider } from '../utils';

interface Props {
  onSelect: ({provider: ZapProvider, endpoint: string}) => void;
  web3: any;
  address: string;
}

interface State {
  providers: ZapProvider[];
  endpoints: string[];
  provider: ZapProvider;
  endpoint: string;
  loading: boolean;
  providerText: string;
}

export class OracleEndpointSelect extends React.PureComponent<Props, State> {

  addressRe = /^(0x)?[0-9a-f]{40}$/i;

  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      endpoints: [],
      provider: null,
      endpoint: '',
      loading: false,
      providerText: '',
    }
  }

  componentDidMount() {
    this.setState({loading: true});
    getProvidersWithTitles(this.props.web3, this.props.address).then(providers => {
      this.setState({providers});
    })
  }

  handleProviderTextChange(providerText) {
    this.setState({providerText});
    if (this.addressRe.test(providerText) || !providerText) this.handleProviderSelect(providerText);
  }

  handleProviderSelect(address) {
    if (!this.addressRe.test(address)) {
      this.setState({
        provider: null,
        providerText: '',
        endpoint: '',
        endpoints: [],
      });
      this.props.onSelect(null);
      return;
    }
    const providers = this.state.providers;
    let i = providers.length;
    while (i--) {
      if (providers[i].providerOwner !== address) continue;
      this.setState({
        provider: providers[i],
        providerText: providers[i].providerOwner,
        endpoint: '',
        endpoints: [],
      });
      this.updateProviderEndpoints(providers[i]);
      return;
    }
    // if provider address is not in list
    loadProvider(this.props.web3, address).then(provider => {
      this.setState({
        provider: provider,
        providerText: provider.providerOwner,
        endpoint: '',
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

  handleEndpointChange(endpoint) {
    this.setState({endpoint});
  }

  handleEndpointSelect(endpoint) {
    if (!endpoint) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
      endpoint,
      provider: this.state.provider
    });
  }

  render() {
    const { providers, endpoints, provider, endpoint, providerText } = this.state;
    const providerOptions = providers.map(provider => ({value: provider.providerOwner, name: provider.title + ' ' + provider.providerOwner}))
    const endpointOptions = endpoints.map(endpoint => ({name: endpoint, value: endpoint}));
    return (
      <React.Fragment>
        <div className="form-group">
          <label>Oracle address</label>
          <InputAutocomplete
            placehoder="Provider address"
            value={providerText}
            options={providerOptions}
            onChange={e => {this.handleProviderTextChange(e)}}
            onSelect={e => {this.handleProviderSelect(e)}} />
        </div>
        <div className="form-group">
          <label>Endpoint</label>
          <InputAutocomplete
            disabled={!endpointOptions.length}
            placehoder={endpointOptions.length ? 'Select endpoint' : 'Provider has no endpoints'}
            value={endpoint}
            onBlur={e => {this.handleEndpointSelect(e)}}
            onChange={e => {this.handleEndpointChange(e)}}
            options={endpointOptions}
            onSelect={e => {this.handleEndpointSelect(e)}}
          />
        </div>
      </React.Fragment>
    )
  }
}
